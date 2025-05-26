<template>
  <div class="dashboard-home p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard, {{ userName }}!</h1>
    <p class="text-gray-600 mb-8">
      Ready to conquer the day? Here's your mission briefing.
    </p>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Progress Card -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Your Progress</h2>
        <p class="font-lato text-gray-600 mb-4">You have completed {{ completedChallenges }} out of {{ totalChallenges }} challenges.</p>
        <div class="mt-4 h-2 bg-gray-200 rounded-full">
          <div class="h-full bg-[#fe572a] rounded-full" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="font-lato text-sm text-gray-500 mt-2">{{ progressPercentage }}% complete</p>
      </div>

      <!-- Current Challenge -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Current Challenge</h2>
        <div v-if="currentChallenge">
          <div class="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 class="font-crimson-pro text-lg font-bold text-gray-800 mb-2">{{ currentChallenge.description }}</h4>
            <p class="font-lato text-sm text-gray-600 mb-1"><strong>Objective:</strong> {{ currentChallenge.objective }}</p>
            <div class="flex flex-wrap gap-4 font-lato text-sm text-gray-600 mb-2">
              <p><strong>Time:</strong> {{ currentChallenge.estimated_time }}</p>
              <p><strong>XP:</strong> {{ currentChallenge.xp_value }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="font-lato text-gray-600 mb-4">No challenges generated yet.</p>
          <router-link to="/dashboard/challenges" class="inline-block bg-[#fe572a] text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200">
            Get Started
          </router-link>
        </div>
      </div>

      <!-- Leaderboard Position -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Leaderboard Position</h2>
        <p class="font-lato text-gray-600">You are ranked <strong>#{{ leaderboardPosition }}</strong> on the leaderboard.</p>
      </div>
    </div>

    <!-- Motivational Section -->
    <div class="mt-8 p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 class="font-crimson-pro text-2xl font-bold mb-2 text-gray-800">Keep Going, {{ userName }}!</h2>
      <p class="font-lato text-lg text-gray-600">"The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { auth, db } from '../firebase'; // Ensure correct import of Firebase instances
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  name: 'DashboardHome',
  setup() {
    const userName = ref('');
    const completedChallenges = ref(0);
    const totalChallenges = ref(0);
    const currentChallenge = ref(null);
    const leaderboardPosition = ref(0);
    const upcomingChallenges = ref([]);
    const router = useRouter();

    const progressPercentage = computed(() => {
      return totalChallenges.value > 0 ? Math.round((completedChallenges.value / totalChallenges.value) * 100) : 0;
    });

    const loadChallenges = async (userId) => {
      const today = new Date().toISOString().split('T')[0];
      const challengeDocRef = doc(db, 'challenges', 'global');
      const challengeDoc = await getDoc(challengeDocRef);
      const challenges = challengeDoc.exists() ? challengeDoc.data().challenges || [] : [];

      const userChallengeDocRef = doc(db, 'user_challenges', userId);
      const userChallengeDoc = await getDoc(userChallengeDocRef);
      const pendingChallenges = userChallengeDoc.exists() ? userChallengeDoc.data().pending_challenges || [] : [];

      upcomingChallenges.value = pendingChallenges
        .filter(userChallenge => userChallenge.date > today && userChallenge.status === 'pending')
        .map(userChallenge => {
          const challenge = challenges.find(c => c.challenge_id === userChallenge.challenge_id);
          return challenge ? { ...challenge, ...userChallenge } : null;
        })
        .filter(challenge => challenge !== null);
    };

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        userName.value = user.displayName || 'Hero';
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          completedChallenges.value = data.completedChallenges || 0;
          totalChallenges.value = data.totalChallenges || 0;
          currentChallenge.value = data.currentChallenge || null;
          leaderboardPosition.value = data.leaderboardPosition || 0;

          // Log the current challenge to the console
          console.log('Current Challenge:', currentChallenge.value);
        }
      } else {
        router.push('/signin');
      }
    };

    onMounted(async () => {
      await fetchUserData();
      if (auth.currentUser) {
        await loadChallenges(auth.currentUser.uid);
      }
    });

    return {
      userName,
      completedChallenges,
      totalChallenges,
      currentChallenge,
      leaderboardPosition,
      progressPercentage,
      upcomingChallenges,
    };
  },
};
</script>

<style scoped>
.dashboard-home {
  background-color: #f7fafc;
}
</style>
