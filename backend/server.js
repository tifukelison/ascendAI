import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();
const app = express();
const PORT = 3000;
const YT_API_KEY = process.env.VITE_YOUTUBE_API_KEY;
const videoCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(cors());
app.use(express.json());

app.get('/api/youtube/search', async (req, res) => {
  try {
    const { q, skillLevel, order = 'viewCount' } = req.query;
    
    if (!q && !skillLevel) {
      return res.status(400).json({ error: 'Missing search parameters' });
    }

    const cacheKey = `${q}-${skillLevel}-${order}`;
    const cachedResults = videoCache.get(cacheKey);
    
    if (cachedResults) {
      return res.json({ items: cachedResults });
    }

    // Search for videos with longer duration
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${q} ${skillLevel} tutorial`,
        type: 'video',
        videoDuration: 'long',
        maxResults: 12,
        order: order,
        key: YT_API_KEY,
        relevanceLanguage: 'en',
        regionCode: 'US'
      }
    });

    // Get video details including statistics
    const videoIds = searchResponse.data.items.map(item => item.id.videoId);
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails,snippet,statistics',
        id: videoIds.join(','),
        key: YT_API_KEY
      }
    });

    // Combine and filter results
    const items = searchResponse.data.items
      .map((item, index) => {
        const details = detailsResponse.data.items[index];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`,
          duration: details.contentDetails.duration,
          description: details.snippet.description,
          viewCount: parseInt(details.statistics?.viewCount || 0),
          likeCount: parseInt(details.statistics?.likeCount || 0)
        };
      })
      .sort((a, b) => b.viewCount - a.viewCount); // Sort by most viewed

    // Cache the results
    videoCache.set(cacheKey, items);

    res.json({ items });

  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: error.response?.data?.error?.message || 'Failed to fetch videos'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});