<!-- /frontend/src/components/Challenges.vue -->
<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Your Challenges</h2>
    <p class="text-gray-600 mb-4">Working on <strong>{{ focusSkill }}</strong> to achieve your goal: <strong>{{ goal }}</strong>.</p>

    <!-- Progress Bar and Badges (Shown First for Returning Users) -->
    <div v-if="preferencesSet" class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Your Progress</h3>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div :style="{ width: `${progressPercentage}%` }" class="bg-blue-600 h-4 rounded-full"></div>
      </div>
      <p class="text-gray-600 mt-2">{{ completedChallenges }} / 30 Challenges Completed ({{ progressPercentage }}%)</p>
      <p><strong>Current Streak:</strong> {{ streak }} days 🔥</p>
      <p><strong>Longest Streak:</strong> {{ longestStreak }} days</p>
      <p><strong>Badges:</strong> {{ badges.length ? badges.join(', ') : 'No badges yet!' }}</p>
      <p><strong>Progress Badges:</strong> {{ progressBadges.length ? progressBadges.join(', ') : 'No progress badges yet!' }}</p>
    </div>

    <!-- Configuration Form (Shown Only if Preferences Not Set) -->
    <div v-if="!preferencesSet">
      <form @submit.prevent="submitForm">
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Challenge Frequency</label>
          <div class="space-y-2">
            <div>
              <input type="radio" id="daily" value="daily" v-model="form.frequency" class="mr-2">
              <label for="daily" class="text-gray-700">Daily</label>
            </div>
            <div>
              <input type="radio" id="3x-week" value="3x/week" v-model="form.frequency" class="mr-2">
              <label for="3x-week" class="text-gray-700">3x/Week</label>
            </div>
            <div>
              <input type="radio" id="weekly" value="weekly" v-model="form.frequency" class="mr-2">
              <label for="weekly" class="text-gray-700">Weekly</label>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="form.skipAllowanceEnabled" class="mr-2">
            <span class="text-gray-700">Allow up to 3 skips per month (preserves streak)</span>
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" :disabled="isLoading">
          {{ isLoading ? 'Generating Challenges...' : 'Save Preferences & Generate Challenges' }}
        </button>
      </form>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="mt-6 flex justify-center">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>

    <!-- Confirmation Message -->
    <div v-if="confirmationMessage" class="mt-4 p-4 bg-green-100 text-green-800 rounded">
      {{ confirmationMessage }}
    </div>

    <!-- Today's Challenge -->
    <div v-if="currentChallenge && preferencesSet" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Today's Challenge</h3>
      <div class="p-4 bg-blue-50 rounded-lg shadow-md">
        <h4 class="text-lg font-bold">{{ currentChallenge.description }}</h4>
        <p class="text-gray-600 mt-1"><strong>Objective:</strong> {{ currentChallenge.objective }}</p>
        <p class="text-gray-600 mt-1"><strong>Estimated Time:</strong> {{ currentChallenge.estimated_time }}</p>
        <p class="text-gray-600 mt-1"><strong>XP Value:</strong> {{ currentChallenge.xp_value }}</p>
        <p class="text-gray-600 mt-1"><strong>Time Remaining:</strong> {{ countdown }}</p>
        <button
          v-if="!hasStarted"
          @click="startChallenge"
          class="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Accept/Start
        </button>
        <p v-else class="mt-2 text-gray-600">Started at: {{ startTime }}</p>
      </div>
    </div>

    <!-- Past Challenges (Faded) -->
    <div v-if="pastChallenges.length && preferencesSet" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Past Challenges</h3>
      <div class="space-y-4">
        <div v-for="challenge in pastChallenges" :key="challenge.challenge_id" class="p-4 bg-gray-50 rounded-lg shadow-sm opacity-50">
          <p><strong>{{ challenge.description }}</strong></p>
          <p class="text-gray-600"><strong>Objective:</strong> {{ challenge.objective }}</p>
          <p class="text-gray-600"><strong>Date:</strong> {{ challenge.date }}</p>
          <p class="text-gray-600"><strong>Status:</strong> {{ challenge.status }}</p>
        </div>
      </div>
    </div>

    <!-- Upcoming Challenges (Blurred) -->
    <div v-if="upcomingChallenges.length && preferencesSet" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Upcoming Challenges</h3>
      <div class="space-y-4">
        <div v-for="challenge in upcomingChallenges" :key="challenge.challenge_id" class="p-4 bg-gray-50 rounded-lg shadow-sm blur-sm">
          <p><strong>{{ challenge.description }}</strong></p>
          <p class="text-gray-600"><strong>Objective:</strong> {{ challenge.objective }}</p>
          <p class="text-gray-600"><strong>Date:</strong> {{ challenge.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      frequency: 'daily',
      skipAllowanceEnabled: true,
    });
    const focusSkill = ref('');
    const goal = ref('');
    const confirmationMessage = ref('');
    const challenges = ref([]);
    const currentChallenge = ref(null);
    const pastChallenges = ref([]);
    const upcomingChallenges = ref([]);
    const isLoading = ref(false);
    const preferencesSet = ref(false);
    const hasStarted = ref(false);
    const startTime = ref(null);
    const countdown = ref('');
    const completedChallenges = ref(0);
    const streak = ref(0);
    const longestStreak = ref(0);
    const badges = ref([]);
    const progressBadges = ref([]);

    // Countdown Timer Logic
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const timeLeft = endOfDay - now;

      if (timeLeft <= 0) {
        countdown.value = 'Expired';
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      countdown.value = `${hours}h ${minutes}m ${seconds}s`;
    };
    const countdownInterval = setInterval(updateCountdown, 1000);
    onUnmounted(() => clearInterval(countdownInterval));

    // Progress Percentage
    const progressPercentage = computed(() => {
      return Math.round((completedChallenges.value / 30) * 100);
    });

    // Fetch user data and challenges on mount
    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        focusSkill.value = data.focusSkill || 'Unknown Skill';
        goal.value = data.goal || 'No goal set';
        streak.value = data.streak || 0;
        longestStreak.value = data.longest_streak || 0;
        badges.value = data.badges || [];
        progressBadges.value = data.progress_badges || [];
        preferencesSet.value = !!data.challenge_frequency;
        if (data.challenge_frequency) form.value.frequency = data.challenge_frequency;
        if (data.skip_allowance !== undefined) form.value.skipAllowanceEnabled = data.skip_allowance > 0;
      }

      if (preferencesSet.value) {
        await loadChallenges(user.uid);
      }
    });

    // Load challenges
    const loadChallenges = async (userId) => {
      const today = new Date().toISOString().split('T')[0];
      const userChallengesQuery = query(
        collection(db, 'user_challenges'),
        where('user_id', '==', userId)
      );
      const userChallengesSnapshot = await getDocs(userChallengesQuery);
      const userChallenges = userChallengesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Separate challenges into past, current, and upcoming
      for (const userChallenge of userChallenges) {
        const challengeDoc = await getDoc(doc(db, 'challenges', userChallenge.challenge_id));
        if (challengeDoc.exists()) {
          const challengeData = { ...challengeDoc.data(), date: userChallenge.date, status: userChallenge.status };
          if (userChallenge.date < today) {
            pastChallenges.value.push(challengeData);
          } else if (userChallenge.date === today) {
            currentChallenge.value = challengeData;
            hasStarted.value = !!userChallenge.start_time;
            startTime.value = userChallenge.start_time ? new Date(userChallenge.start_time).toLocaleString() : null;
          } else {
            upcomingChallenges.value.push(challengeData);
          }
        }
      }

      // Calculate completed challenges for progress
      completedChallenges.value = userChallenges.filter(uc => uc.status === 'completed').length;

      // Award progress badges
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      let userProgressBadges = userDoc.data().progress_badges || [];
      const percentage = progressPercentage.value;

      if (percentage >= 35 && !userProgressBadges.includes('Achiever')) userProgressBadges.push('Achiever');
      if (percentage >= 50 && !userProgressBadges.includes('Trailblazer')) userProgressBadges.push('Trailblazer');
      if (percentage >= 65 && !userProgressBadges.includes('Master')) userProgressBadges.push('Master');
      if (percentage >= 80 && !userProgressBadges.includes('Legend')) userProgressBadges.push('Legend');
      if (percentage >= 100 && !userProgressBadges.includes('Champion')) userProgressBadges.push('Champion');

      if (userProgressBadges.length !== progressBadges.value.length) {
        await updateDoc(userDocRef, { progress_badges: userProgressBadges });
        progressBadges.value = userProgressBadges;
      }
    };

    // Submit form and generate challenges
    const submitForm = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);

      try {
        isLoading.value = true;

        // Save preferences to Firestore
        await updateDoc(userDocRef, {
          challenge_frequency: form.value.frequency,
          skip_allowance: form.value.skipAllowanceEnabled ? 3 : 0,
          skip_count: 0,
          challenges_generated: false, // Reset to allow generation
        });

        // Call Netlify Function to generate challenges
        const userDoc = await getDoc(userDocRef);
        const response = await fetch('/.netlify/functions/generate-challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            focusSkill: focusSkill.value,
            level: userDoc.data().level,
            goal: goal.value,
            challengeFrequency: form.value.frequency,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          confirmationMessage.value = result.message;
          challenges.value = result.challenges;
          preferencesSet.value = true;
          await loadChallenges(user.uid);
        } else {
          confirmationMessage.value = `Error: ${result.error} - ${result.details || ''}`;
        }
      } catch (error) {
        console.error('Error:', error);
        confirmationMessage.value = 'Error generating challenges. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    // Start challenge
    const startChallenge = async () => {
      const user = auth.currentUser;
      if (!user || !currentChallenge.value) return;

      const userChallengeId = `${user.uid}-${currentChallenge.value.challenge_id}`;
      const userChallengeRef = doc(db, 'user_challenges', userChallengeId);

      try {
        const startTimestamp = new Date().toISOString();
        await updateDoc(userChallengeRef, {
          start_time: startTimestamp,
        });
        hasStarted.value = true;
        startTime.value = new Date(startTimestamp).toLocaleString();
      } catch (error) {
        console.error('Error starting challenge:', error);
        confirmationMessage.value = 'Error starting challenge. Please try again.';
      }
    };

    return {
      form,
      focusSkill,
      goal,
      confirmationMessage,
      challenges,
      currentChallenge,
      pastChallenges,
      upcomingChallenges,
      isLoading,
      preferencesSet,
      hasStarted,
      startTime,
      countdown,
      completedChallenges,
      progressPercentage,
      streak,
      longestStreak,
      badges,
      progressBadges,
      submitForm,
      startChallenge,
    };
  },
};
</script>