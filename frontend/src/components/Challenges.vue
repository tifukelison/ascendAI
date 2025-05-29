<!-- /frontend/src/components/Challenges.vue -->
<template>
  <div class="min-h-screen relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-20"></div>

    <!-- Loader Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#fe572a] rounded-full animate-spin"></div>
    </div>

    <!-- Feedback Modal -->
    <div
      v-if="showFeedbackModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]"
    >
      <div class="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Challenge Feedback</h3>
        <VueMarkdownRender :source="selectedFeedback" class="font-lato text-gray-800 prose" />
        <button
          @click="closeFeedbackModal"
          class="mt-4 w-full bg-[#fe572a] text-white font-lato font-bold py-2 rounded-lg hover:bg-[#ff8c63] transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Progress Chart Modal -->
    <div
      v-if="showChartModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]"
    >
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full">
        <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Progress Over Time</h3>
        <div class="chart-container">
          <canvas ref="modalProgressChart" class="h-64 w-full"></canvas>
        </div>
        <button
          @click="showChartModal = false"
          class="mt-4 w-full bg-[#fe572a] text-white font-lato font-bold py-2 rounded-lg hover:bg-[#ff8c63] transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>

    <div class="container w-full px-4 py-6 lg:px-4 relative z-10 overflow-x-hidden">
      <!-- Notification Popup -->
      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 max-w-sm p-4 rounded-xl shadow-lg bg-white border border-gray-200 animate-slide-in z-[10000]"
        :class="notificationType === 'success' ? 'border-green-200' : 'border-red-200'"
      >
        <div class="flex items-start">
          <svg
            v-if="notificationType === 'success'"
            class="w-6 h-6 text-green-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p class="font-lato text-gray-800">{{ notificationMessage }}</p>
          <button @click="dismissNotification" class="ml-2 text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Welcome and Instructions Section -->
      <div v-if="!preferencesSet || !challengesGenerated" class="p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 class="font-crimson-pro text-3xl text-gray-800 mb-4">Welcome to Your Challenge Hub!</h2>
        <p class="font-lato text-gray-600 mb-4">
          Ahoy, dream chaser! 🚀 Ready to turbocharge your skills and conquer your goals? This is your personal arena of awesomeness where you can set your preferences, track your epic progress, and tackle challenges crafted just for you.
        </p>
        <p class="font-lato text-gray-600">
          <strong>Here's the game plan:</strong>
          <ul class="list-disc list-inside">
            <li>Set Up Your Challenges: Choose how often you want to be challenged. Daily, thrice a week, or weekly—your call! It's like choosing your own adventure, but with more XP.</li>
            <li>Track Your Progress: Keep an eye on your streaks, XP, and badges. Every challenge completed is a step closer to mastery. Like a ninja leveling up, you're unstoppable!</li>
            <li>Accept and Conquer: Dive into today's challenge or peek at what's coming up. Remember, every challenge is a chance to shine. If you're waiting for a sign, this is it. Literally.</li>
          Aldous Huxley
            <li>Revisit Feedback: Click on past challenges to review feedback and refine your skills.</li>
          </ul>
        </p>
        <p class="font-lato text-gray-600 mt-4">Let's get started and make some magic happen! 🌟</p>
      </div>

      <!-- Configuration Section -->
      <div v-if="!preferencesSet || !challengesGenerated" class="p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 class="font-crimson-pro text-3xl text-gray-800 mb-6">Set Up Your Challenges</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-6">
            <label class="block font-lato text-gray-800 font-medium mb-2">Challenge Frequency</label>
            <div class="space-y-2">
              <div>
                <input type="radio" id="daily" value="daily" v-model="form.frequency" class="mr-2">
                <label for="daily" class="font-lato text-gray-800">Daily</label>
              </div>
              <div>
                <input type="radio" id="3x-week" value="3x/week" v-model="form.frequency" class="mr-2">
                <label for="3x-week" class="font-lato text-gray-800">3x/Week</label>
              </div>
              <div>
                <input type="radio" id="weekly" value="weekly" v-model="form.frequency" class="mr-2">
                <label for="weekly" class="font-lato text-gray-800">Weekly</label>
              </div>
            </div>
          </div>
          <div class="mb-6">
            <label class="flex items-center">
              <input type="checkbox" v-model="form.skipAllowanceEnabled" class="mr-2">
              <span class="font-lato text-gray-800">Allow up to 3 skips per month (preserves streak)</span>
            </label>
          </div>
          <button
            type="submit"
            class="w-full bg-[#fe572a] text-white font-lato font-bold px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Generating Challenges...' : 'Save & Generate Challenges' }}
          </button>
        </form>
      </div>

      <!-- Challenges Section -->
      <div v-if="preferencesSet && challengesGenerated" class="flex flex-col gap-8">
        <!-- Main Challenges Content -->
        <div class="flex flex-col gap-8">
          <!-- Progress and Progress Over Time Section -->
          <div class="flex flex-col lg:flex-row gap-8 mb-8">
            <!-- Progress Section -->
            <div class="p-6 rounded-lg border border-gray-200 shadow-sm w-full lg:w-1/3">
              <h2 class="font-crimson-pro text-3xl text-gray-800 mb-4">
                Your Progress, {{ username }}
              </h2>
              <p class="font-lato text-gray-600 mb-4">
                Skill: <strong>{{ focusSkill }}</strong> | Goal: <strong>{{ goal }}</strong> | XP: <strong>{{ userXp }}</strong>
              </p>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  class="bg-[#fe572a] h-2.5 rounded-full transition-width duration-300"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <p class="font-lato text-sm text-gray-600 mb-2">
                {{ completedChallenges }} / 30 Challenges ({{ progressPercentage }}%)
              </p>
              <div class="flex flex-wrap gap-4 font-lato text-gray-600">
                <p><strong>Streak:</strong> {{ streak }} days</p>
                <p><strong>Longest Streak:</strong> {{ longestStreak }} days</p>
                <p><strong>Badges:</strong> {{ badges.length ? badges.join(', ') : 'None yet!' }}</p>
              </div>
            </div>

            <!-- Progress Over Time Section -->
            <div
              class="p-6 rounded-lg border border-gray-200 shadow-sm lg:w-2/3 cursor-pointer"
              @click="showChartModal = true"
            >
              <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Progress Over Time</h3>
              <div class="chart-container">
                <canvas ref="progressChart" class="h-[150px]"></canvas>
              </div>
            </div>
          </div>

          <!-- Current and Upcoming Challenges Section -->
          <div class="p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
            <div v-if="currentChallenge">
              <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Current Challenge</h3>
              <div class="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 class="font-crimson-pro text-lg font-bold text-gray-800 mb-2">{{ currentChallenge.description }}</h4>
                <p class="font-lato text-sm text-gray-600 mb-1"><strong>Objective:</strong> {{ currentChallenge.objective }}</p>
                <div class="flex flex-wrap gap-4 font-lato text-sm text-gray-600 mb-2">
                  <p><strong>Time:</strong> {{ currentChallenge.estimated_time }}</p>
                  <p><strong>XP:</strong> {{ currentChallenge.xp_value }}</p>
                  <p><strong>Remaining:</strong> {{ countdown }}</p>
                </div>
                <div v-if="!hasStarted">
                  <button
                    @click="startChallenge"
                    class="w-full bg-[#fe572a] text-white font-lato font-bold py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
                  >
                    Accept/Start
                  </button>
                  <p class="font-lato text-sm text-gray-600 mt-2">
                      Currently, challenge submissions are textbased. You can submit your work as text or code.
                    </p>
                </div>
                <div v-else>
                  <p class="font-lato text-sm text-gray-600 mb-2">Started: {{ startTime }}</p>
                  <button
                    v-if="!showSubmissionInput"
                    @click="showSubmissionInput = true"
                    class="w-full bg-[#fe572a] text-white font-lato font-bold py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
                  >
                    Submit Work
                  </button>
                  <div v-if="showSubmissionInput" class="mt-4">
                    <p class="font-lato text-sm text-gray-600 mb-2">Submit your work (code or text):</p>
                    <div class="mb-4">
                      <textarea
                        v-model="userSubmission"
                        placeholder="Enter your work here..."
                        class="w-full p-4 bg-white border-2 border-gray-300 rounded-lg font-lato text-gray-800 resize-none focus:outline-none focus:border-[#fe572a] transition-all duration-200 scrollbar-none h-32"
                      ></textarea>
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="submitChallenge"
                        class="bg-[#fe572a] text-white font-lato font-bold py-2 px-4 rounded-lg hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
                        :disabled="!userSubmission"
                      >
                        Submit Work
                      </button>
                      <button
                        @click="showSubmissionInput = false"
                        class="bg-gray-200 text-gray-800 font-lato py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                    <p class="font-lato text-sm text-gray-600 mt-2">
                      You can revisit feedback by clicking on a past challenge.
                    </p>
                    <div v-if="isSubmitting" class="mt-4 flex justify-center">
                      <div class="w-8 h-8 border-4 border-gray-200 border-t-[#fe572a] rounded-full animate-spin"></div>
                    </div>
                    <div v-if="feedback" class="mt-4 p-4 bg-gray-100 rounded-lg max-h-64 overflow-y-auto">
                      <h4 class="font-lato font-bold text-gray-800 mb-2">Feedback:</h4>
                      <VueMarkdownRender :source="feedback" class="font-lato text-gray-800 prose" />
                      <button
                        v-if="verificationResult && verificationResult.passed"
                        @click="handleFeedbackResponse"
                        class="mt-4 w-full bg-[#fe572a] text-white font-lato font-bold py-2 rounded-lg hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
                      >
                        Okay, Next Challenge
                      </button>
                      <button
                        v-else
                        @click="retrySubmission"
                        class="mt-4 w-full bg-[#fe572a] text-white font-lato font-bold py-2 rounded-lg hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="currentChallenge">
                <!-- Existing content for currentChallenge -->
              </div>
              <div v-else>
                <p class="font-lato text-gray-600">No challenge available for today. Check upcoming challenges or generate new ones.</p>
              </div>
            </div>
          </div>

          <!-- Upcoming and Past Challenges Section -->
          <div class="flex flex-col lg:flex-row lg:gap-8">
            <!-- Upcoming Challenges -->
            <div v-if="upcomingChallenges.length" class="lg:w-1/2 mb-8">
              <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Upcoming Challenges</h3>
              <div class="space-y-4">
                <div
                  v-for="challenge in paginatedUpcomingChallenges"
                  :key="challenge.challenge_id"
                  @click="showLockedMessage"
                  class="border border-gray-200 rounded-lg p-4 shadow-sm opacity-50 cursor-pointer relative"
                  :class="{ 'bg-orange-50 border-orange-300': challenge.challenge_id === nextChallengeId }"
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
              <div class="mt-6 flex justify-center items-center" v-if="upcomingChallenges.length > 0">
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

            <!-- Past Challenges -->
            <div v-if="pastChallenges.length" class="lg:w-1/2">
              <h3 class="font-crimson-pro text-xl text-gray-800 mb-4">Past Challenges</h3>
              <div class="space-y-4">
                <div
                  v-for="challenge in paginatedPastChallenges"
                  :key="challenge.challenge_id"
                  @click="fetchChallengeFeedback(challenge.challenge_id)"
                  class="border border-gray-200 rounded-lg p-4 shadow-sm opacity-50 cursor-pointer"
                >
                  <p class="font-crimson-pro text-lg font-bold text-gray-800">{{ challenge.description }}</p>
                  <p class="font-lato text-sm text-gray-600"><strong>Objective:</strong> {{ challenge.objective }}</p>
                  <p class="font-lato text-sm text-gray-600"><strong>Date:</strong> {{ challenge.date }}</p>
                  <p class="font-lato text-sm text-gray-600"><strong>Status:</strong> {{ challenge.status }}</p>
                </div>
              </div>
              <div class="mt-6 flex justify-center items-center" v-if="pastChallenges.length > 0">
                <button
                  @click="prevPastPage"
                  :disabled="pastCurrentPage === 1"
                  class="font-lato font-bold py-2 px-4 rounded-l transition-all duration-200"
                  :class="pastCurrentPage === 1 ? 'bg-gray-200 text-gray-800 cursor-not-allowed' : 'bg-[#fe572a] text-white hover:bg-[#ff8c63]'"
                >
                  Prev
                </button>
                <span class="px-4 py-2 text-gray-700 bg-gray-100 font-lato">Page {{ pastCurrentPage }} of {{ pastTotalPages }}</span>
                <button
                  @click="nextPastPage"
                  :disabled="pastCurrentPage === pastTotalPages"
                  class="font-lato font-bold py-2 px-4 rounded-r transition-all duration-200"
                  :class="pastCurrentPage === pastTotalPages ? 'bg-gray-200 text-gray-800 cursor-not-allowed' : 'bg-[#fe572a] text-white hover:bg-[#ff8c63]'"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateChallenges, provideChallengeFeedback, verifyChallengeSubmission } from '../callGenerateChallenges';
import Chart from 'chart.js/auto';
import VueMarkdownRender from 'vue-markdown-render';

export default {
  components: {
    VueMarkdownRender,
  },
  setup() {
    const router = useRouter();
    const form = ref({
      frequency: 'daily',
      skipAllowanceEnabled: true,
    });
    const username = ref('');
    const userXp = ref(0);
    const focusSkill = ref('');
    const goal = ref('');
    const challenges = ref([]);
    const currentChallenge = ref(null);
    const pastChallenges = ref([]);
    const upcomingChallenges = ref([]);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const preferencesSet = ref(false);
    const challengesGenerated = ref(false);
    const hasStarted = ref(false);
    const startTime = ref(null);
    const countdown = ref('');
    const completedChallenges = ref(0);
    const streak = ref(0);
    const longestStreak = ref(0);
    const badges = ref([]);
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationType = ref('success');
    const showSubmissionInput = ref(false);
    const userSubmission = ref('');
    const feedback = ref('');
    const verificationResult = ref(null);
    const progressChart = ref(null);
    const modalProgressChart = ref(null);
    const showFeedbackModal = ref(false);
    const selectedFeedback = ref('');
    const showChartModal = ref(false);

    // Pagination for Upcoming Challenges
    const currentPage = ref(1);
    const challengesPerPage = 3;
    const totalPages = computed(() => Math.ceil(upcomingChallenges.value.length / challengesPerPage));
    const paginatedUpcomingChallenges = computed(() => {
      const start = (currentPage.value - 1) * challengesPerPage;
      const end = start + challengesPerPage;
      return upcomingChallenges.value.slice(start, end);
    });

    // Pagination for Past Challenges
    const pastCurrentPage = ref(1);
    const pastChallengesPerPage = 3;
    const pastTotalPages = computed(() => Math.ceil(pastChallenges.value.length / pastChallengesPerPage));
    const paginatedPastChallenges = computed(() => {
      const start = (pastCurrentPage.value - 1) * pastChallengesPerPage;
      const end = start + pastChallengesPerPage;
      return pastChallenges.value.slice(start, end);
    });

    // Next Upcoming Challenge
    const nextChallengeId = computed(() => {
      if (!upcomingChallenges.value.length) return null;
      const nextChallenge = upcomingChallenges.value.reduce((earliest, current) =>
        !earliest || current.date < earliest.date ? current : earliest
      );
      return nextChallenge.challenge_id;
    });

    // Progress Percentage
    const progressPercentage = computed(() => {
      return Math.round((completedChallenges.value / 30) * 100);
    });

    // Format Time for Countdown
    const formatTime = (timeLeft) => {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // Countdown Timer
    const updateCountdown = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const timeLeft = endOfDay - now;

      if (timeLeft <= 0) {
        countdown.value = '00:00:00';
        if (currentChallenge.value && hasStarted.value) {
          await markChallengeAsUncompleted();
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const completionDates = userDoc.data().completion_dates || [];
          const today = now.toISOString().split('T')[0];
          if (!completionDates.includes(today)) {
            await updateDoc(userDocRef, { streak: 0 });
            streak.value = 0;
            showNotificationModal('No challenges completed today. Streak reset.', 'info');
          }
        }
        await loadChallenges(user.uid);
        return;
      }

      countdown.value = formatTime(timeLeft);
    };
    const countdownInterval = setInterval(updateCountdown, 1000);
    onUnmounted(() => clearInterval(countdownInterval));

    // Fetch User Data and Challenges
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
        username.value = data.name || 'User';
        userXp.value = data.xp || 0;
        focusSkill.value = data.focusSkill || 'Unknown Skill';
        goal.value = data.goal || 'No goal set';
        streak.value = data.streak || 0;
        longestStreak.value = data.longest_streak || 0;
        badges.value = data.badges || [];
        preferencesSet.value = !!data.challenge_frequency;
        challengesGenerated.value = !!data.challenges_generated;
        if (data.challenge_frequency) form.value.frequency = data.challenge_frequency;
        if (data.skip_allowance !== undefined) form.value.skipAllowanceEnabled = data.skip_allowance > 0;
      }

      if (preferencesSet.value && challengesGenerated.value) {
        await loadChallenges(user.uid);
        initializeChart();
      }
    });

    // Load Challenges
    const loadChallenges = async (userId) => {
      console.log('Loading challenges for user:', userId);
      const today = new Date().toISOString().split('T')[0];

      const challengeDocRef = doc(db, 'challenges', focusSkill.value);
      const challengeDoc = await getDoc(challengeDocRef);
      if (challengeDoc.exists()) {
        challenges.value = challengeDoc.data().challenges || [];
        console.log('Global challenges loaded:', challenges.value);
      } else {
        console.warn('No global challenges found for focusSkill:', focusSkill.value);
        challenges.value = [];
      }

      const userChallengeDocRef = doc(db, 'user_challenges', userId);
      const userChallengeDoc = await getDoc(userChallengeDocRef);
      let pendingChallenges = [];
      if (userChallengeDoc.exists()) {
        pendingChallenges = userChallengeDoc.data().pending_challenges || [];
        console.log('Pending challenges:', pendingChallenges);
      } else {
        console.warn('No user_challenges document found for user:', userId);
      }

      pastChallenges.value = [];
      currentChallenge.value = null;
      upcomingChallenges.value = [];
      completedChallenges.value = 0;

      for (const userChallenge of pendingChallenges) {
        const challenge = challenges.value.find(c => c.challenge_id === userChallenge.challenge_id);
        if (challenge) {
          const challengeData = {
            ...challenge,
            date: userChallenge.date,
            status: userChallenge.status,
            start_time: userChallenge.start_time,
            verification: userChallenge.verification,
          };
          if (userChallenge.date < today || userChallenge.status === 'completed' || userChallenge.status === 'uncompleted') {
            pastChallenges.value.push(challengeData);
            if (userChallenge.status === 'completed') completedChallenges.value++;
          } else if (userChallenge.status === 'pending') {
            if (!currentChallenge.value) {
              currentChallenge.value = challengeData;
              hasStarted.value = !!userChallenge.start_time;
              startTime.value = userChallenge.start_time ? new Date(userChallenge.start_time).toLocaleString() : null;
            } else {
              upcomingChallenges.value.push(challengeData);
            }
          }
        } else {
          console.warn('No matching global challenge found for challenge_id:', userChallenge.challenge_id);
        }
      }

      upcomingChallenges.value.sort((a, b) => a.date.localeCompare(b.date));
      console.log('Current challenge:', currentChallenge.value);
      console.log('Upcoming challenges:', upcomingChallenges.value);
      console.log('Past challenges:', pastChallenges.value);
      console.log('Completed challenges:', completedChallenges.value);
    };

    // Submit Form and Generate Challenges
    const submitForm = async () => {
      const user = auth.currentUser;
      if (!user) {
        showNotificationModal('Please sign in to generate challenges.', 'error');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      try {
        isLoading.value = true;

        await updateDoc(userDocRef, {
          challenge_frequency: form.value.frequency,
          skip_allowance: form.value.skipAllowanceEnabled ? 3 : 0,
          skip_count: 0,
          challenges_generated: false,
          completion_dates: [],
          xp: 0,
        });

        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        const result = await generateChallenges(
          user.uid,
          focusSkill.value,
          userData.level || 'beginner',
          goal.value,
          form.value.frequency
        );

        const userChallengeDocRef = doc(db, 'user_challenges', user.uid);
        const userChallengeDoc = await getDoc(userChallengeDocRef);
        const newChallenges = result.challenges.map(ch => ({
          challenge_id: ch.challenge_id,
          date: ch.date,
          status: 'pending',
          start_time: null,
          verification: null,
        }));

        if (!userChallengeDoc.exists()) {
          await setDoc(userChallengeDocRef, {
            user_id: user.uid,
            pending_challenges: newChallenges,
          });
        } else {
          const existingChallenges = userChallengeDoc.data().pending_challenges || [];
          await updateDoc(userChallengeDocRef, {
            pending_challenges: [...existingChallenges, ...newChallenges],
          });
        }

        showNotificationModal(result.message, 'success');
        challenges.value = result.challenges;
        preferencesSet.value = true;
        challengesGenerated.value = true;
        await loadChallenges(user.uid);
        initializeChart();
      } catch (error) {
        console.error('Error generating challenges:', error);
        showNotificationModal(`Error generating challenges: ${error.message}`, 'error');
      } finally {
        isLoading.value = false;
      }
    };

    // Start Challenge
    const startChallenge = async () => {
      const user = auth.currentUser;
      if (!user || !currentChallenge.value) return;

      const userChallengeDocRef = doc(db, 'user_challenges', user.uid);

      try {
        const userChallengeDoc = await getDoc(userChallengeDocRef);
        let pendingChallenges = userChallengeDoc.exists() ? userChallengeDoc.data().pending_challenges || [] : [];
        const challengeIndex = pendingChallenges.findIndex(c => c.challenge_id === currentChallenge.value.challenge_id);

        if (challengeIndex !== -1) {
          const startTimestamp = new Date().toISOString();
          pendingChallenges[challengeIndex].start_time = startTimestamp;
          await updateDoc(userChallengeDocRef, { pending_challenges: pendingChallenges });
          hasStarted.value = true;
          startTime.value = new Date(startTimestamp).toLocaleString();
          showNotificationModal('Challenge accepted! Get started.', 'success');
        }
      } catch (error) {
        console.error('Error starting challenge:', error);
        showNotificationModal('Error starting challenge. Please try again.', 'error');
      }
    };

    // Submit Challenge
    const submitChallenge = async () => {
      const user = auth.currentUser;
      if (!user) {
        showNotificationModal('You must be signed in to submit a challenge.', 'error');
        router.push('/signin');
        return;
      }
      if (!userSubmission.value) {
        showNotificationModal('Please provide a submission.', 'error');
        return;
      }
      if (!currentChallenge.value || !currentChallenge.value.challenge_id) {
        showNotificationModal('Invalid challenge data.', 'error');
        return;
      }

      try {
        isSubmitting.value = true;
        const feedbackResult = await provideChallengeFeedback(currentChallenge.value, userSubmission.value);
        const verificationResultData = await verifyChallengeSubmission(currentChallenge.value, userSubmission.value);

        if (typeof feedbackResult !== 'string' || !feedbackResult.trim()) {
          throw new Error('Invalid feedback: must be a non-empty string');
        }
        if (!verificationResultData || typeof verificationResultData.passed !== 'boolean') {
          throw new Error('Invalid verification result: must be an object with a boolean "passed" property');
        }

        feedback.value = feedbackResult;
        verificationResult.value = verificationResultData;

        const userChallengeDocRef = doc(db, 'user_challenges', user.uid);
        const userChallengeDoc = await getDoc(userChallengeDocRef);

        if (!userChallengeDoc.exists()) {
          await setDoc(userChallengeDocRef, {
            user_id: user.uid,
            pending_challenges: [],
          });
        }

        const feedbackDocRef = doc(db, 'user_challenges', user.uid, 'feedback', currentChallenge.value.challenge_id);

        const feedbackData = {
          feedback: feedbackResult.trim(),
          verification: { passed: verificationResultData.passed },
          timestamp: new Date().toISOString(),
        };

        await setDoc(feedbackDocRef, feedbackData);

        const updatedUserChallengeDoc = await getDoc(userChallengeDocRef);
        let pendingChallenges = updatedUserChallengeDoc.exists() ? updatedUserChallengeDoc.data().pending_challenges || [] : [];
        const challengeIndex = pendingChallenges.findIndex(c => c.challenge_id === currentChallenge.value.challenge_id);

        if (challengeIndex !== -1) {
          pendingChallenges[challengeIndex].verification = verificationResultData.passed;
          await updateDoc(userChallengeDocRef, { pending_challenges: pendingChallenges });
        } else {
          console.warn('Challenge not found in pending_challenges:', currentChallenge.value.challenge_id);
          showNotificationModal('Challenge not found. Please try again.', 'error');
          return;
        }

        if (!verificationResultData.passed) {
          showNotificationModal('Submission does not meet requirements. Please revise and resubmit.', 'error');
        }
      } catch (error) {
        console.error('Submission error:', error);
        showNotificationModal(`Failed to process submission: ${error.message}`, 'error');
      } finally {
        isSubmitting.value = false;
      }
    };

    // Handle Feedback Response
    const handleFeedbackResponse = async () => {
      const user = auth.currentUser;
      if (!user) {
        showNotificationModal('You must be signed in to proceed.', 'error');
        router.push('/signin');
        return;
      }

      try {
        if (verificationResult.value && verificationResult.value.passed) {
          const userChallengeDocRef = doc(db, 'user_challenges', user.uid);
          const userChallengeDoc = await getDoc(userChallengeDocRef);
          let pendingChallenges = userChallengeDoc.exists() ? userChallengeDoc.data().pending_challenges || [] : [];
          const challengeIndex = pendingChallenges.findIndex(c => c.challenge_id === currentChallenge.value.challenge_id);

          if (challengeIndex !== -1) {
            pendingChallenges[challengeIndex].status = 'completed';
            await updateDoc(userChallengeDocRef, { pending_challenges: pendingChallenges });

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            let userStreak = userDoc.data().streak || 0;
            let userLongestStreak = userDoc.data().longest_streak || 0;
            let completionDates = userDoc.data().completion_dates || [];
            let currentXp = userDoc.data().xp || 0;
            const today = new Date().toISOString().split('T')[0];

            if (!completionDates.includes(today)) {
              completionDates.push(today);
              userStreak++;
              if (userStreak > userLongestStreak) userLongestStreak = userStreak;
              currentXp += currentChallenge.value.xp_value || 0;
              await updateDoc(userDocRef, {
                streak: userStreak,
                longest_streak: userLongestStreak,
                completion_dates: completionDates,
                xp: currentXp,
              });
              streak.value = userStreak;
              longestStreak.value = userLongestStreak;
              userXp.value = currentXp;
            }

            completedChallenges.value++;
            showNotificationModal('Challenge completed successfully!', 'success');
          } else {
            showNotificationModal('Challenge not found. Please try again.', 'error');
            return;
          }
        } else {
          showNotificationModal('Please retry the current challenge before proceeding.', 'error');
          return;
        }

        showSubmissionInput.value = false;
        userSubmission.value = '';
        feedback.value = '';
        verificationResult.value = null;
        currentChallenge.value = null;
        hasStarted.value = false;
        startTime.value = null;
        await loadChallenges(user.uid);
        initializeChart();

        if (!currentChallenge.value && upcomingChallenges.value.length === 0) {
          showNotificationModal('No more challenges available. Generate new ones.', 'info');
        }
      } catch (error) {
        console.error('Error advancing to next challenge:', error);
        showNotificationModal(`Failed to advance to next challenge: ${error.message}`, 'error');
      }
    };

    // Retry Submission
    const retrySubmission = () => {
      showSubmissionInput.value = true;
      feedback.value = '';
      verificationResult.value = null;
    };

    // Mark Challenge as Uncompleted
    const markChallengeAsUncompleted = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userChallengeDocRef = doc(db, 'user_challenges', user.uid);
      const userChallengeDoc = await getDoc(userChallengeDocRef);
      let pendingChallenges = userChallengeDoc.exists() ? userChallengeDoc.data().pending_challenges || [] : [];
      const challengeIndex = pendingChallenges.findIndex(c => c.challenge_id === currentChallenge.value.challenge_id);

      if (challengeIndex !== -1) {
        pendingChallenges[challengeIndex].status = 'uncompleted';
        await updateDoc(userChallengeDocRef, { pending_challenges: pendingChallenges });
        await loadChallenges(user.uid);
        showNotificationModal('Challenge time expired. Marked as uncompleted.', 'error');
      }
    };

    // Fetch Challenge Feedback
    const fetchChallengeFeedback = async (challengeId) => {
      const user = auth.currentUser;
      if (!user) {
        showNotificationModal('You must be signed in to view feedback.', 'error');
        router.push('/signin');
        return;
      }

      try {
        const feedbackDocRef = doc(db, 'user_challenges', user.uid, 'feedback', challengeId);
        const feedbackDoc = await getDoc(feedbackDocRef);
        if (feedbackDoc.exists()) {
          selectedFeedback.value = feedbackDoc.data().feedback || 'No feedback available.';
          showFeedbackModal.value = true;
        } else {
          showNotificationModal('No feedback found for this challenge.', 'error');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        showNotificationModal(`Failed to fetch feedback: ${error.message}`, 'error');
      }
    };

    // Close Feedback Modal
    const closeFeedbackModal = () => {
      showFeedbackModal.value = false;
      selectedFeedback.value = '';
    };

    // Notification Modal
    const showNotificationModal = (message, type) => {
      notificationMessage.value = message;
      notificationType.value = type;
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 5000);
    };

    const dismissNotification = () => {
      showNotification.value = false;
    };

    // Show Locked Message
    const showLockedMessage = () => {
      showNotificationModal('Please complete the current challenge first.', 'error');
    };

    // Pagination Controls for Upcoming Challenges
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    // Pagination Controls for Past Challenges
    const prevPastPage = () => {
      if (pastCurrentPage.value > 1) {
        pastCurrentPage.value--;
      }
    };

    const nextPastPage = () => {
      if (pastCurrentPage.value < pastTotalPages.value) {
        pastCurrentPage.value++;
      }
    };

    // Initialize Chart
    const initializeChart = () => {
      if (progressChart.value && progressChart.value.chart) {
        progressChart.value.chart.destroy();
      }
      if (modalProgressChart.value && modalProgressChart.value.chart) {
        modalProgressChart.value.chart.destroy();
      }

      const xpData = pastChallenges.value
        .filter(ch => ch.status === 'completed')
        .map(ch => ch.xp_value || 0);
      const labels = pastChallenges.value
        .filter(ch => ch.status === 'completed')
        .map((_, index) => `${index + 1}`);

      // Main Chart
      if (progressChart.value) {
        const ctx = progressChart.value.getContext('2d');
        progressChart.value.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
              label: 'XP Earned',
              data: xpData.length ? xpData : [0],
              borderColor: '#fe572a',
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 150);
                gradient.addColorStop(0, 'rgba(254, 87, 42, 0.5)');
                gradient.addColorStop(1, 'rgba(254, 87, 42, 0)');
                return gradient;
              },
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              x: {
                easing: 'easeInOutQuad',
                duration: 1000,
                from: 0,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'XP',
                  font: { family: 'Lato' },
                  color: '#22252a',
                },
                ticks: { color: '#22252a', font: { family: 'Lato' } },
              },
              x: {
                title: {
                  display: true,
                  text: `Completed Challenges (${labels.join(', ') || 'None'})`,
                  font: { family: 'Lato' },
                  color: '#22252a',
                },
                ticks: { color: '#22252a', font: { family: 'Lato' } },
              },
            },
            plugins: {
              legend: {
                labels: { font: { family: 'Lato' }, color: '#22252a' },
              },
            },
          },
        });
      }

      // Modal Chart
      if (modalProgressChart.value) {
        const modalCtx = modalProgressChart.value.getContext('2d');
        modalProgressChart.value.chart = new Chart(modalCtx, {
          type: 'line',
          data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
              label: 'XP Earned',
              data: xpData.length ? xpData : [0],
              borderColor: '#fe572a',
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(254, 87, 42, 0.5)');
                gradient.addColorStop(1, 'rgba(254, 87, 42, 0)');
                return gradient;
              },
              fill: true,
              tension: 0.4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'XP',
                  font: { family: 'Lato' },
                  color: '#22252a',
                },
                ticks: { color: '#22252a', font: { family: 'Lato' } },
              },
              x: {
                title: {
                  display: true,
                  text: `Completed Challenges (${labels.join(', ') || 'None'})`,
                  font: { family: 'Lato' },
                  color: '#22252a',
                },
                ticks: { color: '#22252a', font: { family: 'Lato' } },
              },
            },
            plugins: {
              legend: {
                labels: { font: { family: 'Lato' }, color: '#22252a' },
              },
            },
          },
        });
      }
    };

    return {
      form,
      username,
      userXp,
      focusSkill,
      goal,
      challenges,
      currentChallenge,
      pastChallenges,
      upcomingChallenges,
      isLoading,
      isSubmitting,
      preferencesSet,
      challengesGenerated,
      hasStarted,
      startTime,
      countdown,
      completedChallenges,
      progressPercentage,
      streak,
      longestStreak,
      badges,
      showNotification,
      notificationMessage,
      notificationType,
      showSubmissionInput,
      userSubmission,
      feedback,
      verificationResult,
      progressChart,
      modalProgressChart,
      showFeedbackModal,
      selectedFeedback,
      showChartModal,
      currentPage,
      totalPages,
      paginatedUpcomingChallenges,
      pastCurrentPage,
      pastTotalPages,
      paginatedPastChallenges,
      nextChallengeId,
      submitForm,
      startChallenge,
      submitChallenge,
      handleFeedbackResponse,
      retrySubmission,
      fetchChallengeFeedback,
      closeFeedbackModal,
      dismissNotification,
      showLockedMessage,
      prevPage,
      nextPage,
      prevPastPage,
      nextPastPage,
    };
  },
};
</script>

<style scoped>
/* Background Grid Pattern */
.bg-grid-pattern {
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Slide-in Animation for Notification */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}

/* Hide Scrollbars */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Chart Container */
.chart-container {
  width: 100%;
}

/* Markdown Styles */
.prose {
  max-width: none;
}
.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  font-family: 'Lato', sans-serif;
  color: #22252a;
}
.prose p,
.prose ul,
.prose ol {
  font-family: 'Lato', sans-serif;
  color: #22252a;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .text-3xl {
    font-size: 1.5rem;
  }
  .text-xl {
    font-size: 1.125rem;
  }
  input,
  textarea {
    font-size: 0.9rem;
  }
}
</style>