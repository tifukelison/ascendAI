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
        <p class="font-lato text-gray-600 mb-4">You've completed {{ completedCourses }} out of {{ totalCourses }} courses.</p>
        <div class="mt-4 h-2 bg-gray-200 rounded-full">
          <div class="h-full bg-[#fe572a] rounded-full" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="font-lato text-sm text-gray-500 mt-2">{{ progressPercentage }}% complete</p>
      </div>

      <!-- Upcoming Challenges -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Upcoming Challenges</h2>
        <ul v-if="upcomingChallenges.length" class="list-disc list-inside font-lato text-gray-600">
          <li v-for="challenge in upcomingChallenges" :key="challenge.id">{{ challenge.description }} by {{ challenge.dueDate }}</li>
        </ul>
        <div v-else class="text-center">
          <p class="font-lato text-gray-600 mb-4">No challenges generated yet.</p>
          <router-link to="/dashboard/challenges" class="inline-block bg-[#fe572a] text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200">
            Get Started
          </router-link>
        </div>
      </div>

      <!-- Leaderboard Position -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Leaderboard Position</h2>
        <p class="font-lato text-gray-600">You are currently ranked <strong>#{{ leaderboardPosition }}</strong> on the leaderboard.</p>
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
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'DashboardHome',
  setup() {
    const userName = ref('');
    const completedCourses = ref(0);
    const totalCourses = ref(0);
    const upcomingChallenges = ref([]);
    const leaderboardPosition = ref(0);

    const progressPercentage = computed(() => {
      return totalCourses.value > 0 ? Math.round((completedCourses.value / totalCourses.value) * 100) : 0;
    });

    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        userName.value = user.displayName || 'Hero';
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          completedCourses.value = data.completedCourses || 0;
          totalCourses.value = data.totalCourses || 0;
          upcomingChallenges.value = data.upcomingChallenges || [];
          leaderboardPosition.value = data.leaderboardPosition || 0;
        }
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      userName,
      completedCourses,
      totalCourses,
      upcomingChallenges,
      leaderboardPosition,
      progressPercentage,
    };
  },
};
</script>

<style scoped>
.dashboard-home {
  background-color: #f7fafc;
}
</style>