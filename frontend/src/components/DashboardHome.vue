<!-- /frontend/src/components/DashboardHome.vue -->
<template>
  <div class="dashboard-home p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard, {{ userName }}!</h1>
    <p class="text-gray-600 mb-8">
      Ready to conquer the day? Here's your mission briefing.
    </p>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Progress Card -->
      <div class="p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
        <h2 class="font-crimson-pro text-xl text-gray-800 mb-4">Your Progress</h2>
        <div class="relative w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <circle
              class="text-gray-200 stroke-current"
              stroke-width="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              class="text-[#fe572a] stroke-current"
              stroke-width="10"
              stroke-linecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
            ></circle>
            <text
              x="50"
              y="50"
              fill="#22252a"
              text-anchor="middle"
              dy=".3em"
              class="font-lato text-xl font-bold"
            >
              {{ progressPercentage }}%
            </text>
          </svg>
        </div>
        <p class="font-lato text-sm text-gray-600 mt-4">
          {{ completedChallenges }} of {{ totalChallenges }} challenges completed
        </p>
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
              <p><strong>Remaining:</strong> {{ countdown }}</p>
            </div>
            <router-link
              to="/dashboard/challenges"
              class="inline-block bg-[#fe572a] text-white font-lato font-bold py-2 px-4 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
            >
              Go to Challenge
            </router-link>
          </div>
        </div>
        <div v-else>
          <p class="font-lato text-gray-600 mb-4">No challenge available for today. Generate new challenges to get started.</p>
          <router-link
            to="/dashboard/challenges"
            class="inline-block bg-[#fe572a] text-white font-lato font-bold py-2 px-4 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
          >
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

    <!-- Upcoming Challenges Section -->
    <div v-if="upcomingChallenges.length" class="mt-8 p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 class="font-crimson-pro text-2xl text-gray-800 mb-4">Upcoming Challenges</h2>
      <div class="space-y-4">
        <div
          v-for="challenge in paginatedUpcomingChallenges"
          :key="challenge.challenge_id"
          class="border border-gray-200 rounded-lg p-4 shadow-sm opacity-50 relative"
        >
          <div class="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#fe572a"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v3a2 2 0 01-2 2h-2a2 2 0 01-2-2v-3zm0 0V8a4 4 0 018 0v3"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span
            v-if="challenge.challenge_id === nextChallengeId"
            class="absolute top-2 left-2 bg-[#fe572a] text-white text-xs font-lato font-bold px-2 py-1 rounded-full"
          >
            Next
          </span>
          <p class="font-crimson-pro text-lg font-bold text-gray-800">{{ challenge.description }}</p>
          <p class="font-lato text-sm text-gray-600"><strong>Objective:</strong> {{ challenge.objective }}</p>
          <p class="font-lato text-sm text-gray-600"><strong>Date:</strong> {{ challenge.date }}</p>
        </div>
      </div>
      <div class="mt-6 flex justify-center items-center" v-if="upcomingChallenges.length > challengesPerPage">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="font-lato font-bold py-2 px-4 rounded-l transition-all duration-200"
          :class="currentPage === 1 ? 'bg-gray-200 text-gray-800 cursor-not-allowed' : 'bg-[#fe572a] text-white hover:bg-[#ff8c63]'"
        >
          Prev
        </button>
        <span class="px-4 py-2 text-gray-700 bg-gray-100 font-lato">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="font-lato font-bold py-2 px-4 rounded-r transition-all duration-200"
          :class="currentPage === totalPages ? 'bg-gray-200 text-gray-800 cursor-not-allowed' : 'bg-[#fe572a] text-white hover:bg-[#ff8c63]'"
        >
          Next
        </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  name: 'DashboardHome',
  setup() {
    const userName = ref('');
    const completedChallenges = ref(0);
    const totalChallenges = ref(30); // Align with Challenges.vue
    const currentChallenge = ref(null);
    const leaderboardPosition = ref(0);
    const upcomingChallenges = ref([]);
    const currentPage = ref(1);
    const challengesPerPage = 3;
    const countdown = ref('');
    const router = useRouter();

    // Progress Circle
    const progressPercentage = computed(() => {
      return totalChallenges.value > 0 ? Math.round((completedChallenges.value / totalChallenges.value) * 100) : 0;
    });
    const circumference = computed(() => 2 * Math.PI * 40); // Circumference for r=40
    const dashOffset = computed(() => circumference.value * (1 - progressPercentage.value / 100));

    // Pagination
    const totalPages = computed(() => Math.ceil(upcomingChallenges.value.length / challengesPerPage));
    const paginatedUpcomingChallenges = computed(() => {
      const start = (currentPage.value - 1) * challengesPerPage;
      return upcomingChallenges.value.slice(start, start + challengesPerPage);
    });

    // Next Challenge
    const nextChallengeId = computed(() => {
      if (!upcomingChallenges.value.length) return null;
      return upcomingChallenges.value.reduce((earliest, current) =>
        !earliest || current.date < earliest.date ? current : earliest
      ).challenge_id;
    });

    // Countdown Timer
    const formatTime = (timeLeft) => {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const timeLeft = endOfDay - now;
      countdown.value = timeLeft > 0 ? formatTime(timeLeft) : '00:00:00';
    };

    let countdownInterval = null;
    onMounted(() => {
      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    });
    onUnmounted(() => clearInterval(countdownInterval));

    // Load Challenges
    const loadChallenges = async (userId) => {
      console.log('Loading challenges for user:', userId);
      try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch user focus skill
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const focusSkill = userDoc.exists() ? userDoc.data().focusSkill || 'default' : 'default';
        console.log('Focus skill:', focusSkill);

        // Fetch global challenges
        const challengeDocRef = doc(db, 'challenges', focusSkill);
        const challengeDoc = await getDoc(challengeDocRef);
        const challenges = challengeDoc.exists() ? challengeDoc.data().challenges || [] : [];
        console.log('Global challenges:', challenges);

        // Fetch user-specific challenges
        const userChallengeDocRef = doc(db, 'user_challenges', userId);
        const userChallengeDoc = await getDoc(userChallengeDocRef);
        const pendingChallenges = userChallengeDoc.exists() ? userChallengeDoc.data().pending_challenges || [] : [];
        console.log('Pending challenges:', pendingChallenges);

        // Reset state
        upcomingChallenges.value = [];
        currentChallenge.value = null;
        completedChallenges.value = 0;

        // Process challenges
        for (const userChallenge of pendingChallenges) {
          const challenge = challenges.find(c => c.challenge_id === userChallenge.challenge_id);
          if (challenge) {
            const challengeData = {
              ...challenge,
              date: userChallenge.date,
              status: userChallenge.status,
              start_time: userChallenge.start_time,
              verification: userChallenge.verification,
            };
            console.log('Processing challenge:', challengeData);
            if (userChallenge.status === 'pending') {
              if (userChallenge.date === today) {
                currentChallenge.value = challengeData;
              } else if (userChallenge.date > today) {
                upcomingChallenges.value.push(challengeData);
              }
            }
            if (userChallenge.status === 'completed') {
              completedChallenges.value++;
            }
          } else {
            console.warn('No matching global challenge for ID:', userChallenge.challenge_id);
          }
        }

        // Sort upcoming challenges
        upcomingChallenges.value.sort((a, b) => a.date.localeCompare(b.date));
        console.log('Current challenge:', currentChallenge.value);
        console.log('Upcoming challenges:', upcomingChallenges.value);
        console.log('Completed challenges:', completedChallenges.value);
      } catch (error) {
        console.error('Error loading challenges:', error);
      }
    };

    // Fetch User Data
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          userName.value = user.displayName || 'Hero';
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            leaderboardPosition.value = data.leaderboardPosition || 0;
            await loadChallenges(user.uid);
          } else {
            console.warn('User document not found for UID:', user.uid);
            router.push('/signin');
          }
        } else {
          console.warn('No authenticated user found');
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/signin');
      }
    };

    // Pagination Controls
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(fetchUserData);

    return {
      userName,
      completedChallenges,
      totalChallenges,
      currentChallenge,
      leaderboardPosition,
      progressPercentage,
      circumference,
      dashOffset,
      upcomingChallenges,
      currentPage,
      challengesPerPage,
      totalPages,
      paginatedUpcomingChallenges,
      nextChallengeId,
      countdown,
      prevPage,
      nextPage,
    };
  },
};
</script>

<style scoped>
.dashboard-home {
  background-color: #f7fafc;
}

@media (max-width: 768px) {
  .dashboard-home {
    padding: 1rem;
  }
  .text-3xl {
    font-size: 1.5rem;
  }
  .text-2xl {
    font-size: 1.25rem;
  }
  .text-xl {
    font-size: 1.125rem;
  }
}
</style>