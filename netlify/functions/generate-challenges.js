// /home/tifukelison/Desktop/Ascendia/ascendAI/netlify/functions/generate-challenges.js
// Load environment variables from .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

console.log('Loading generate-challenges function...');

// Import dependencies using CommonJS
const admin = require('firebase-admin');
const ModelClient = require('@azure-rest/ai-inference').default;
const { isUnexpected } = require('@azure-rest/ai-inference');
const { AzureKeyCredential } = require('@azure/core-auth');

console.log('Dependencies loaded');

// Initialize Firebase Admin SDK without a service account
try {
  admin.initializeApp({
    projectId: 'ascendai-gwxob', // Replace with your Firebase project ID
  });
} catch (error) {
  // Ignore "already initialized" error if running in Netlify
  if (!error.message.includes('already exists')) {
    throw error;
  }
}
const db = admin.firestore();
console.log('Firebase initialized');

// Initialize Azure AI Client
const token = process.env.GITHUB_TOKEN;
const endpoint = process.env.AZURE_ENDPOINT || 'https://models.github.ai/inference';
const model = process.env.AI_MODEL || 'openai/gpt-4.1';

if (!token) {
  throw new Error('GITHUB_TOKEN environment variable is not set');
}
console.log('Azure AI credentials loaded');

const client = ModelClient(endpoint, new AzureKeyCredential(token));
console.log('Azure AI client initialized');

// Main handler function
exports.handler = async (event) => {
  console.log('Handler invoked with event:', event);

  // Check for POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Verify the Authorization header (ID token)
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized: Missing or invalid Authorization header' }),
    };
  }

  const idToken = authHeader.split('Bearer ')[1];

  // Verify the ID token
  let decodedToken;
  try {
    console.log('Verifying ID token...');
    decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID token verified, user ID:', decodedToken.uid);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Invalid ID token', details: error.message }),
    };
  }

  const userIdFromToken = decodedToken.uid;

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const { userId, focusSkill, level, goal, challengeFrequency } = body;

  // Validate that the userId matches the token's user ID
  if (userId !== userIdFromToken) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: User ID does not match authenticated user' }),
    };
  }

  // Validate request fields
  if (!userId || !focusSkill || !level || !goal || !challengeFrequency) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields', received: { userId, focusSkill, level, goal, challengeFrequency } }),
    };
  }

  try {
    // Check if challenges are already generated
    console.log('Checking if challenges are already generated for user:', userId);
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    if (userDoc.exists && userDoc.data().challenges_generated) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Challenges already generated. Complete existing challenges first.' }),
      };
    }

    // Check for existing challenges to avoid duplicates
    console.log('Querying existing challenges...');
    const existingChallenges = await db.collection('challenges')
      .where('focusSkill', '==', focusSkill)
      .where('level', '==', level)
      .where('goal', '==', goal)
      .get();
    const existingDescriptions = existingChallenges.docs.map(doc => doc.data().description);
    console.log('Existing challenges found:', existingDescriptions.length);

    // Generate 30 challenges
    const challengesNeeded = 30 - existingChallenges.size;
    let newChallenges = [];

    if (challengesNeeded > 0) {
      console.log(`Generating ${challengesNeeded} new challenges...`);
      const prompt = `Generate ${challengesNeeded} unique challenges for ${focusSkill} at ${level} level, aligned with the goal "${goal}". Each challenge should take 15-30 minutes, include clear instructions, a resource link, an objective tying back to the goal, and an XP value (15-30 XP based on difficulty). Ensure no duplicates with these descriptions: ${existingDescriptions.join(', ')}. Output ONLY the JSON array, with no additional text before or after. The format should be: [{"description": "", "resource": "", "objective": "", "estimated_time": "15-30 minutes", "xp_value": 15}, ...]`;

      // Add timeout to Azure AI request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
      try {
        const response = await client.path('/chat/completions').post({
          body: {
            messages: [
              { role: 'system', content: 'You are a helpful assistant for generating learning challenges. Output only the requested JSON with no additional text.' },
              { role: 'user', content: prompt },
            ],
            temperature: 1,
            top_p: 1,
            model: model,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isUnexpected(response)) {
          throw new Error(response.body.error?.message || 'Unexpected response from AI model');
        }

        const aiResponse = response.body.choices[0].message.content;
        console.log('AI response received:', aiResponse);

        // Attempt to extract JSON array if the response isn't pure JSON
        let jsonString = aiResponse;
        try {
          JSON.parse(jsonString);
        } catch (error) {
          console.log('AI response is not pure JSON, attempting to extract JSON array...');
          const start = aiResponse.indexOf('[');
          const end = aiResponse.lastIndexOf(']') + 1;
          if (start === -1 || end === 0) {
            throw new Error('No JSON array found in AI response');
          }
          jsonString = aiResponse.substring(start, end);
        }

        newChallenges = JSON.parse(jsonString);
        console.log('New challenges parsed:', newChallenges.length);
      } catch (error) {
        clearTimeout(timeoutId);
        throw new Error(`Azure AI request failed: ${error.message}`);
      }
    }

    // Combine existing and new challenges
    console.log('Combining challenges...');
    const allChallenges = [
      ...existingChallenges.docs.map(doc => doc.data()),
      ...newChallenges.map((chal, index) => ({
        challenge_id: `${focusSkill}-${level}-${Date.now()}-${index}`,
        focusSkill,
        level,
        goal,
        description: chal.description,
        resource: chal.resource,
        objective: chal.objective,
        estimated_time: chal.estimated_time,
        xp_value: chal.xp_value,
        status: 'available',
        created_by: userId,
      })),
    ].slice(0, 30);

    // Store new challenges in Firestore
    console.log('Storing new challenges in Firestore...');
    const batch = db.batch();
    newChallenges.forEach(chal => {
      const challengeRef = db.collection('challenges').doc(chal.challenge_id);
      batch.set(challengeRef, chal);
    });

    // Assign challenges to user based on frequency
    const challengeDates = calculateChallengeDates(challengeFrequency, 30);
    allChallenges.forEach((chal, index) => {
      const userChallengeRef = db.collection('user_challenges').doc(`${userId}-${chal.challenge_id}`);
      batch.set(userChallengeRef, {
        user_id: userId,
        challenge_id: chal.challenge_id,
        date: challengeDates[index],
        status: 'pending',
        submission: null,
        xp_earned: 0,
        feedback: null,
        start_time: null,
      });
    });

    // Mark challenges as generated for the user
    batch.update(userDocRef, { challenges_generated: true });

    await batch.commit();
    console.log('Challenges stored successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Challenges generated successfully', challenges: allChallenges }),
    };
  } catch (error) {
    console.error('Error generating challenges:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate challenges', details: error.message }),
    };
  }
};

// Helper function to calculate challenge dates based on frequency
function calculateChallengeDates(frequency, count) {
  const dates = [];
  const startDate = new Date();
  let incrementDays;

  switch (frequency) {
    case 'daily':
      incrementDays = 1;
      break;
    case '3x/week':
      incrementDays = [2, 2, 3];
      break;
    case 'weekly':
      incrementDays = 7;
      break;
    default:
      incrementDays = 1;
  }

  let currentDate = startDate;
  for (let i = 0; i < count; i++) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);
    if (frequency === '3x/week') {
      currentDate.setDate(currentDate.getDate() + incrementDays[i % 3]);
    } else {
      currentDate.setDate(currentDate.getDate() + incrementDays);
    }
  }

  return dates;
}