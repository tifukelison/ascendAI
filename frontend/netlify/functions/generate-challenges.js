// /frontend/netlify/functions/generate-challenges.js
import { handler } from '@netlify/functions';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

// Initialize GitHub Marketplace Open AI Model
const token = process.env.GITHUB_TOKEN;
const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-4.1';
const client = ModelClient(endpoint, new AzureKeyCredential(token));

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { userId, focusSkill, level, goal, challengeFrequency } = JSON.parse(event.body);

  if (!userId || !focusSkill || !level || !goal || !challengeFrequency) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  try {
    // Check if challenges are already generated
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    if (userDoc.exists && userDoc.data().challenges_generated) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Challenges already generated. Complete existing challenges first.' }),
      };
    }

    // Check for existing challenges to avoid duplicates
    const existingChallenges = await db.collection('challenges')
      .where('focusSkill', '==', focusSkill)
      .where('level', '==', level)
      .where('goal', '==', goal)
      .get();
    const existingDescriptions = existingChallenges.docs.map(doc => doc.data().description);

    // Generate 30 challenges
    const challengesNeeded = 30 - existingChallenges.size;
    let newChallenges = [];

    if (challengesNeeded > 0) {
      const prompt = `Generate ${challengesNeeded} unique challenges for ${focusSkill} at ${level} level, aligned with the goal "${goal}". Each challenge should take 15-30 minutes, include clear instructions, a resource link, an objective tying back to the goal, and an XP value (15-30 XP based on difficulty). Ensure no duplicates with these descriptions: ${existingDescriptions.join(', ')}. Format as JSON: [{ "description": "", "resource": "", "objective": "", "estimated_time": "15-30 minutes", "xp_value": 15 }, ...]`;

      const response = await client.path('/chat/completions').post({
        body: {
          messages: [
            { role: 'system', content: 'You are a helpful assistant for generating learning challenges.' },
            { role: 'user', content: prompt },
          ],
          temperature: 1,
          top_p: 1,
          model: model,
        },
      });

      if (isUnexpected(response)) {
        throw new Error(response.body.error.message);
      }

      newChallenges = JSON.parse(response.body.choices[0].message.content);
    }

    // Combine existing and new challenges
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
      })),
    ].slice(0, 30);

    // Store new challenges in Firestore
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
      incrementDays = [2, 2, 3]; // e.g., Mon, Wed, Fri
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