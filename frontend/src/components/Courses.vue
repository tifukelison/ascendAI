<template>
  <div class="courses-container" :class="{ 'dark-mode': darkMode }">
    <!-- Search Section -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            class="search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Search Courses"
            @keyup.enter="searchVideos"
          />
          <button class="search-icon" @click="searchVideos">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div v-if="isLoading" class="search-loader">
          <div class="loader"></div>
        </div>
      </div>
    </div>

    <!-- Video Player Section -->
    <div v-if="currentVideo" class="video-section">
      <div class="video-player-container">
        <div class="video-player-wrapper">
          <iframe
            :src="playerUrl"
            frameborder="0"
            allowfullscreen
            @load="initPlayer"
            @error="handlePlayerError"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            class="youtube-player"
          ></iframe>
        </div>
      </div>
      
      <!-- Video Metadata -->
      <div class="video-meta">
        <div class="video-header">
          <h2>{{ currentVideo.title }}</h2>
          <button 
            class="bookmark-button"
            @click="toggleBookmark(currentVideo)"
            :class="{ 'bookmarked': isBookmarked(currentVideo.id) }"
          >
            <i class="fas" :class="isBookmarked(currentVideo.id) ? 'fa-bookmark' : 'fa-bookmark-o'"></i>
          </button>
        </div>
        
        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">Duration:</span>
            <span>{{ formattedDuration }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Skill Level:</span>
            <span>{{ currentVideo.skillLevel }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Creator:</span>
            <span>{{ currentVideo.channelTitle }}</span>
          </div>
        </div>
        
        <div class="video-actions">
          <button class="action-button" @click="markAsWatched">
            <i class="fas fa-check-circle"></i> Mark as Watched
          </button>
        </div>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="video-grid">
      <div 
        v-for="video in videos" 
        :key="video.id" 
        class="video-card"
        @click="loadVideo(video)"
        :class="{ 'dark-card': darkMode }"
      >
        <div class="thumbnail-wrapper">
          <img 
            :src="video.thumbnail" 
            :alt="video.title"
            @error="handleThumbnailError"
          >
          <span class="duration-badge">{{ formatDuration(video.duration) }}</span>
          <div v-if="getWatchProgress(video.id)" class="progress-bar">
            <div class="progress-fill" :style="{ width: `${getWatchProgress(video.id)}%` }"></div>
          </div>
        </div>
        <div class="video-info">
          <h4>{{ video.title }}</h4>
          <div class="skill-level">{{ video.skillLevel }}</div>
          <p>{{ video.channelTitle }}</p>
          <div v-if="isBookmarked(video.id)" class="bookmark-indicator">
            <i class="fas fa-bookmark"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export default {
  name: 'Courses',
  data() {
    return {
      searchQuery: '',
      videos: [],
      currentVideo: null,
      player: null,
      playerOptions: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
        controls: 1,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        color: 'white',
        playsinline: 1
      },
      isLoading: false,
      userData: null,
      watchHistory: {},
      bookmarks: []
    };
  },
  computed: {
    playerUrl() {
      return `https://www.youtube-nocookie.com/embed/${this.currentVideo?.id}?${new URLSearchParams({
        ...this.playerOptions,
        origin: window.location.origin
      }).toString()}`;
    },
    formattedDuration() {
      return this.formatDuration(this.currentVideo?.duration);
    },
    ...mapState(['darkMode']),
    userFocusSkill() {
      return this.userData?.focusSkill || 'JavaScript';
    }
  },
  async mounted() {
    await this.loadUserData();
    this.searchVideos();
    window.addEventListener('beforeunload', this.saveWatchProgress);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.saveWatchProgress);
    this.saveWatchProgress();
  },
  methods: {
    async loadUserData() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        this.userData = userDoc.data();
        this.watchHistory = this.userData.watchHistory || {};
        this.bookmarks = this.userData.bookmarks || [];
      }
    },
    async searchVideos() {
      try {
        this.isLoading = true;
        const response = await axios.get('/api/youtube/search', {
          params: {
            q: this.searchQuery || this.userFocusSkill,
            skillLevel: '',
            order: 'viewCount' // Get most popular videos
          }
        });
        this.videos = response.data.items.map(video => ({
          ...video,
          skillLevel: this.detectSkillLevel(video.title)
        }));
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        this.isLoading = false;
      }
    },
    handleThumbnailError(e) {
      e.target.src = 'https://via.placeholder.com/400x225?text=Video+Thumbnail';
    },
    handlePlayerError() {
      console.error('Error loading video player');
      this.currentVideo = null;
    },
    formatDuration(duration) {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return [hours && `${hours}h`, minutes && `${minutes}m`].filter(Boolean).join(' ');
    },
    async loadVideo(video) {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
      this.currentVideo = video;

      // Load YouTube API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Update watch history
      if (!this.watchHistory[video.id]) {
        this.watchHistory[video.id] = { lastWatched: new Date(), progress: 0 };
        await this.saveWatchHistory();
      }
    },
    initPlayer() {
      if (window.YT && window.YT.Player) {
        try {
          this.player = new YT.Player(document.querySelector('.youtube-player'), {
            events: {
              'onStateChange': this.onPlayerStateChange,
              'onReady': this.onPlayerReady
            }
          });
        } catch (error) {
          console.error("Player initialization error", error);
        }
      }
    },
    onPlayerReady(event) {
      // Restore playback position if available
      if (this.currentVideo?.id && this.watchHistory[this.currentVideo.id]?.progress > 0) {
        const duration = event.target.getDuration();
        const seekTo = duration * (this.watchHistory[this.currentVideo.id].progress / 100);
        event.target.seekTo(seekTo, true);
      }
    },
    onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.ENDED) {
        this.awardXP();
      } else if (event.data === YT.PlayerState.PLAYING) {
        this.trackPlayback();
      }
    },
    trackPlayback() {
      // Periodically save playback progress
      this.playbackInterval = setInterval(() => {
        if (this.player && this.currentVideo) {
          const currentTime = this.player.getCurrentTime();
          const duration = this.player.getDuration();
          const progress = (currentTime / duration) * 100;
          this.watchHistory[this.currentVideo.id] = {
            lastWatched: new Date(),
            progress: Math.min(progress, 100)
          };
        }
      }, 5000);
    },
    async saveWatchHistory() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !this.currentVideo) return;

      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), {
        watchHistory: this.watchHistory,
        lastWatched: new Date()
      });
    },
    async saveWatchProgress() {
      if (this.playbackInterval) {
        clearInterval(this.playbackInterval);
      }
      await this.saveWatchHistory();
    },
    async awardXP() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !this.currentVideo) return;

      // Check if XP was already awarded for this video
      if (this.watchHistory[this.currentVideo.id]?.completed) return;

      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), {
        xp: increment(20),
        [`watchHistory.${this.currentVideo.id}.completed`]: true,
        [`watchHistory.${this.currentVideo.id}.completedAt`]: new Date()
      });

      // Update local state
      this.watchHistory[this.currentVideo.id].completed = true;
      if (this.userData) {
        this.userData.xp = (this.userData.xp || 0) + 20;
      }

      alert('Congratulations! You earned 20 XP for completing this video!');
    },
    async markAsWatched() {
      if (this.currentVideo) {
        this.watchHistory[this.currentVideo.id] = {
          lastWatched: new Date(),
          progress: 100,
          completed: true
        };
        await this.saveWatchHistory();
        await this.awardXP();
      }
    },
    getWatchProgress(videoId) {
      return this.watchHistory[videoId]?.progress || 0;
    },
    detectSkillLevel(title) {
      const lcTitle = title.toLowerCase();
      if (lcTitle.includes('beginner')) return 'Beginner';
      if (lcTitle.includes('intermediate')) return 'Intermediate';
      if (lcTitle.includes('advanced')) return 'Advanced';
      return 'All Levels';
    },
    isBookmarked(videoId) {
      return this.bookmarks.some(b => b.id === videoId);
    },
    async toggleBookmark(video) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const videoRef = {
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date()
      };

      if (this.isBookmarked(video.id)) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== video.id);
        await updateDoc(doc(db, 'users', user.uid), {
          bookmarks: this.bookmarks
        });
      } else {
        this.bookmarks.push(videoRef);
        await updateDoc(doc(db, 'users', user.uid), {
          bookmarks: arrayUnion(videoRef)
        });
      }
    }
  }
};
</script>

<style scoped>
.courses-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #fe572a;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(254, 87, 42, 0.2);
}

.search-icon {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #fe572a;
  cursor: pointer;
  font-size: 18px;
}

.search-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
}

/* Video Player Section */
.video-section {
  margin-bottom: 3rem;
}

.video-player-container {
  max-width: 1200px;
  margin: 0 auto;
}

.video-player-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.youtube-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.video-meta {
  margin-top: 1.5rem;
}

.video-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.video-header h2 {
    margin: 0;
    margin-right: auto;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.video-header > * {
  display: flex;
  align-items: center;
  
}



.bookmark-button {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 2rem;
}

.bookmark-button.bookmarked {
  color: #fe572a;
}

.bookmark-button:hover {
  transform: scale(1.1);
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.meta-item {
  background: var(--background-light);
  padding: 1rem;
  border-radius: 8px;
}

.label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.video-actions {
  margin-top: 1.5rem;
}

.action-button {
  padding: 10px 16px;
  background-color: #fe572a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #e04a23;
}

.action-button i {
  margin-right: 8px;
}

/* Video Grid */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.video-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.thumbnail-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  background: #000;
}

.thumbnail-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: #fe572a;
}

.video-info {
  padding: 1rem;
}

.video-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--text-primary);
}

.skill-level {
  display: inline-block;
  padding: 4px 8px;
  background: var(--accent-color);
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 0.5rem 0;
}

.video-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.bookmark-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #fe572a;
  font-size: 1.2rem;
}

/* Dark Mode */
.dark-mode .video-card {
  background: #2d3748;
}

.dark-mode .video-info h4 {
  color: #f7fafc;
}

.dark-mode .video-info p {
  color: #a0aec0;
}

.dark-mode .meta-item {
  background: #4a5568;
}

.dark-mode .label {
  color: #cbd5e0;
}

/* Loader */
.loader {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #fe572a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .video-header h2 {
    font-size: 1.2rem;
    
  }
  .video-header {
      justify-content: space-between;
  }
  
  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>