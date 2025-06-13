// /frontend/src/callGenerateChallenges.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Gemini API key is not defined. Ensure VITE_GEMINI_API_KEY is set in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateChallenges(userId, focusSkill, level, goal, frequency) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 5000,
        temperature: 0.8,
      },
    });

    const prompt = `Generate 30 unique challenges for ${focusSkill} at ${level} level, aligned with the goal "${goal}". Each challenge should take a considerate amount of time, not more than two hours, include clear instructions, an objective tying back to the goal, and an XP value (not more than 200 based on difficulty). Users are required to submit responses in text-only, not images so the challenges should be ones that can be submitted through text. Output ONLY the JSON array as a raw string, with no additional text, no Markdown, no code blocks (e.g., no \`\`\`json or \`\`\`), and no explanations before or after. The format of each challenge in the array must include: description, objective, estimated_time, level, and xp_value.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\n/, "").replace(/\n```$/, "");
    }

    console.log("Cleaned AI model output:", responseText);
    const challenges = JSON.parse(responseText);

    if (!Array.isArray(challenges) || challenges.length !== 30) {
      throw new Error("Expected an array of 30 challenges");
    }

    const scheduledChallenges = scheduleChallenges(challenges, frequency);
    await saveChallengesToFirestore(userId, focusSkill, scheduledChallenges);

    return {
      message: "Challenges generated successfully!",
      challenges: scheduledChallenges,
    };
  } catch (error) {
    console.error("Error generating challenges:", error);
    throw new Error(`Failed to generate challenges: ${error.message}`);
  }
}

function scheduleChallenges(challenges, frequency) {
  const scheduled = [];
  const today = new Date();
  let currentDate = new Date(today);
  let dateIncrement;
  if (frequency === "daily") {
    dateIncrement = 1;
  } else if (frequency === "3x/week") {
    dateIncrement = 2;
  } else if (frequency === "weekly") {
    dateIncrement = 7;
  }

  challenges.forEach((challenge, index) => {
    const challengeDate = new Date(currentDate);
    scheduled.push({
      ...challenge,
      date: challengeDate.toISOString().split("T")[0],
      challenge_id: `ch${index + 1}`,
    });
    currentDate.setDate(currentDate.getDate() + dateIncrement);
  });

  return scheduled;
}

async function saveChallengesToFirestore(userId, focusSkill, challenges) {
  const { db } = await import("./firebase");
  const { doc, setDoc, updateDoc } = await import("firebase/firestore");

  const challengeDocRef = doc(db, "challenges", focusSkill);
  await setDoc(challengeDocRef, { challenges });

  const userChallengeDocRef = doc(db, "user_challenges", userId);
  await setDoc(userChallengeDocRef, {
    user_id: userId,
    pending_challenges: challenges.map(challenge => ({
      challenge_id: challenge.challenge_id,
      date: challenge.date,
      status: "pending",
      start_time: null,
      verification: null,
    })),
  });

  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, { challenges_generated: true });
}

export async function provideChallengeFeedback(challenge, userSubmission) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.8,
      },
    });

    const prompt = `You are an instructor reviewing a submission for a challenge. The challenge is: "${challenge.description}" with objective: "${challenge.objective}". The submission is: "${userSubmission}". Provide detailed feedback, including whether it meets requirements, errors or improvements needed, and next steps. You are talking directly to the user, so make sure the address them in first person. Output as plain text with Markdown formatting (e.g., **bold**, *italic*, - lists).`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error providing challenge feedback:", error);
    throw new Error(`Failed to provide feedback: ${error.message}`);
  }
}

export async function verifyChallengeSubmission(challenge, userSubmission) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.5,
      },
    });

    const prompt = `You are an instructor verifying a submission for a challenge. The challenge is: "${challenge.description}" with objective: "${challenge.objective}". The submission is: "${userSubmission}". Verify if the submission meets the challenge requirements and achieves the objective. Return a JSON object with: { passed: boolean, reason: string }. Output ONLY the JSON object as a raw string, with no additional text or Markdown.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\n/, "").replace(/\n```$/, "");
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error verifying challenge submission:", error);
    throw new Error(`Failed to verify submission: ${error.message}`);
  }
}
