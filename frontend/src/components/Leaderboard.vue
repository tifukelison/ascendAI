<!-- /frontend/src/components/Leaderboard.vue -->
<template>
  <div class="min-h-screen relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-20"></div>

    <!-- Loader Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#fe572a] rounded-full animate-spin"></div>
    </div>

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

    <div class="container w-full px-2 py-6 lg:px-4 relative z-10">
      <h2 class="font-crimson-pro text-3xl text-gray-800 mb-8 text-center">
        Global Leaderboard
      </h2>

      <!-- Filter Section -->
      <div class="filter-section mb-8 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div>
            <label class="block font-lato text-gray-800 font-medium mb-2">Skills</label>
            <select
              v-model="selectedSkill"
              class="w-full sm:w-48 p-2 bg-white border-2 border-gray-300 rounded-lg font-lato text-gray-800 focus:outline-none focus:border-[#fe572a] transition-all duration-200"
            >
              <option value="All Skills">All Skills</option>
              <option v-for="skill in availableSkills" :key="skill" :value="skill">{{ skill }}</option>
            </select>
          </div>
          <div>
            <label class="block font-lato text-gray-800 font-medium mb-2">Location</label>
            <select
              v-model="selectedLocation"
              class="w-full sm:w-48 p-2 bg-white border-2 border-gray-300 rounded-lg font-lato text-gray-800 focus:outline-none focus:border-[#fe572a] transition-all duration-200"
            >
              <option value="Worldwide">Worldwide</option>
              <option v-for="country in availableCountries" :key="country" :value="country">{{ country }}</option>
            </select>
          </div>
        </div>
        <button
          @click="resetFilters"
          class="bg-[#fe572a] text-white font-lato font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
        >
          Reset Filters
        </button>
      </div>

      <!-- User Preview Section -->
      <div class="user-preview mb-8 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img
            :src="currentUser.profilePicture || 'https://via.placeholder.com/60'"
            alt="User Profile"
            class="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
          />
          <div>
            <p class="font-lato font-bold text-gray-800">{{ currentUser.name || 'User' }}</p>
            <p class="font-lato text-sm text-gray-600 flex items-center">
              <span class="fi mr-2" :class="getCountryFlag(currentUser.location)"></span>
              {{ currentUser.location || 'N/A' }}
            </p>
          </div>
        </div>
        <div class="border-l border-gray-200 h-12 hidden sm:block"></div>
        <div class="text-center">
          <p class="font-lato text-gray-800">XP</p>
          <p class="font-lato font-bold text-[#fe572a]">{{ currentUser.xp || 0 }}</p>
        </div>
        <div class="border-l border-gray-200 h-12 hidden sm:block"></div>
        <div class="text-center">
          <p class="font-lato text-gray-800">Want to be in Top 10?</p>
          <button
            class="bg-[#fe572a] text-white font-lato font-bold px-4 py-2 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 mt-2"
          >
            Start Growing with Ascendia
          </button>
        </div>
      </div>

      <!-- Error or Empty State -->
      <div v-if="error" class="p-6 rounded-lg border border-red-200 shadow-sm mb-8 text-center">
        <p class="font-lato text-red-600">{{ error }}</p>
      </div>
      <div v-else-if="!isLoading && filteredLeaderboard.length === 0" class="p-6 rounded-lg border border-gray-200 shadow-sm mb-8 text-center">
        <p class="font-lato text-gray-600">No users found on the leaderboard. Be the first to join!</p>
      </div>

      <!-- Leaderboard Table -->
      <div v-else class="leaderboard-table p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="grid grid-cols-5 gap-4 font-lato font-bold text-gray-800 mb-4">
          <div>Ranking</div>
          <div class="col-span-2">Profile</div>
          <div>Country</div>
          <div>Social</div>
          <div>Skills</div>
        </div>
        <div
          v-for="(user, index) in filteredLeaderboard"
          :key="user.id"
          class="grid grid-cols-5 gap-4 items-center p-4 rounded-lg"
          :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0, 'hover:bg-gray-100 cursor-pointer': true }"
          @click="showUserProfile(user)"
        >
          <!-- Ranking -->
          <div class="flex items-center">
            <span v-if="index === 0" class="fas fa-medal text-yellow-400 mr-2"></span>
            <span v-else-if="index === 1" class="fas fa-medal text-gray-400 mr-2"></span>
            <span v-else-if="index === 2" class="fas fa-medal text-orange-400 mr-2"></span>
            <span v-else class="font-lato text-gray-800">#{{ index + 1 }}</span>
          </div>

          <!-- Profile -->
          <div class="col-span-2 flex items-center gap-4">
            <img
              :src="user.profilePicture || 'https://via.placeholder.com/40'"
              alt="User Profile"
              class="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
            />
            <div>
              <p class="font-lato font-bold text-gray-800">{{ user.name || 'Unknown' }}</p>
              <p class="font-lato text-sm text-gray-600">{{ user.focusSkill || 'N/A' }}</p>
              <p v-if="user.about" class="font-lato text-xs text-gray-500 line-clamp-2">{{ user.about }}</p>
            </div>
          </div>

          <!-- Country -->
          <div class="text-center">
            <span class="fi block mx-auto" :class="getCountryFlag(user.location)"></span>
            <p class="font-lato text-sm text-gray-600">{{ user.location || 'N/A' }}</p>
          </div>

          <!-- Social -->
          <div class="flex gap-2 justify-center">
            <a
              v-if="user.social?.twitter"
              :href="user.social.twitter"
              target="_blank"
              class="text-gray-600 hover:text-[#fe572a]"
            >
              <i class="fab fa-x-twitter"></i>
              <span v-if="user.social.twitterFollowers" class="ml-1 text-xs">{{ formatNumber(user.social.twitterFollowers) }}</span>
            </a>
            <a
              v-if="user.social?.linkedin"
              :href="user.social.linkedin"
              target="_blank"
              class="text-gray-600 hover:text-[#fe572a]"
            >
              <i class="fab fa-linkedin"></i>
              <span v-if="user.social.linkedinFollowers" class="ml-1 text-xs">{{ formatNumber(user.social.linkedinFollowers) }}</span>
            </a>
            <a
              v-if="user.social?.github"
              :href="user.social.github"
              target="_blank"
              class="text-gray-600 hover:text-[#fe572a]"
            >
              <i class="fab fa-github"></i>
              <span v-if="user.social.githubFollowers" class="ml-1 text-xs">{{ formatNumber(user.social.githubFollowers) }}</span>
            </a>
          </div>

          <!-- Skills -->
          <div class="flex items-center gap-2">
            <span
              class="bg-[#fe572a] text-white font-lato text-xs px-2 py-1 rounded-full"
            >
              {{ user.focusSkill || 'N/A' }}
            </span>
            <button
              v-if="user.skills?.length > 1"
              @click.stop="toggleSkills(user.id)"
              class="text-gray-600 hover:text-[#fe572a]"
            >
              +{{ user.skills.length - 1 }}
            </button>
            <div
              v-if="expandedSkills[user.id]"
              class="absolute bg-white border border-gray-200 rounded-lg p-2 shadow-md mt-2"
            >
              <span
                v-for="skill in user.skills.slice(1)"
                :key="skill"
                class="block font-lato text-sm text-gray-600"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Sidebar -->
      <transition name="slide-right">
        <div
          v-if="showProfileSidebar"
          class="profile-sidebar fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg z-[1000] p-6 flex flex-col items-center"
          @click.self="closeProfileSidebar"
        >
          <div class="profile-header flex justify-between items-center w-full mb-6">
            <h2 class="font-crimson-pro text-2xl text-gray-800">User Profile</h2>
            <button @click="closeProfileSidebar" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="selectedUser" class="profile-content flex flex-col items-center w-full">
            <img
              :src="selectedUser.profilePicture || 'https://via.placeholder.com/80'"
              alt="User Profile"
              class="w-20 h-20 rounded-full border-2 border-white shadow-md object-cover mb-4"
            />
            <p class="font-lato font-bold text-gray-800 text-lg">{{ selectedUser.name || 'Unknown' }}</p>
            <p class="font-lato text-sm text-gray-600 flex items-center mb-4">
              <span class="fi mr-2" :class="getCountryFlag(selectedUser.location)"></span>
              {{ selectedUser.location || 'N/A' }}
            </p>
            <p class="font-lato text-gray-800 mb-2"><span class="font-semibold">XP:</span> {{ selectedUser.xp || 0 }}</p>
            <p class="font-lato text-gray-800 mb-2"><span class="font-semibold">Focus Skill:</span> {{ selectedUser.focusSkill || 'N/A' }}</p>
            <p v-if="selectedUser.about" class="font-lato text-gray-600 text-sm text-center mb-4">{{ selectedUser.about }}</p>
            <div class="flex gap-4 mb-4">
              <a
                v-if="selectedUser.social?.twitter"
                :href="selectedUser.social.twitter"
                target="_blank"
                class="text-gray-600 hover:text-[#fe572a]"
              >
                <i class="fab fa-x-twitter text-xl"></i>
                <span v-if="selectedUser.social.twitterFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.twitterFollowers) }}</span>
              </a>
              <a
                v-if="selectedUser.social.linkedin"
                :href="selectedUser.social.linkedin"
                target="_blank"
                class="text-gray-600 hover:text-[#fe572a]"
              >
                <i class="fab fa-linkedin text-xl"></i>
                <span v-if="selectedUser.social.linkedinFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.linkedinFollowers) }}</span>
              </a>
              <a
                v-if="selectedUser.social.github"
                :href="selectedUser.social.github"
                target="_blank"
                class="text-gray-600 hover:text-[#fe572a]"
              >
                <i class="fab fa-github text-xl"></i>
                <span v-if="selectedUser.social.githubFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.githubFollowers) }}</span>
              </a>
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                v-for="skill in selectedUser.skills"
                :key="skill"
                class="bg-[#fe572a] text-white font-lato text-xs px-2 py-1 rounded-full"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          <div v-else class="profile-content">
            <p class="font-lato text-gray-600">No user selected.</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  name: 'Leaderboard',
  setup() {
    const leaderboardData = ref([]);
    const selectedUser = ref(null);
    const showProfileSidebar = ref(false);
    const isLoading = ref(false);
    const error = ref(null);
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationType = ref('success');
    const selectedSkill = ref('All Skills');
    const selectedLocation = ref('Worldwide');
    const expandedSkills = ref({});
    const currentUser = ref({
      profilePicture: null,
      name: 'User',
      location: null,
      xp: 0,
    });

    // Mock available skills and countries (replace with actual data from Firestore if available)
    const availableSkills = ref(['JavaScript', 'Python', 'Java', 'Web Development', 'Data Science']);
    const availableCountries = ref(['USA', 'UK', 'India', 'Brazil', 'Germany']);

    // Computed property for filtered leaderboard
    const filteredLeaderboard = computed(() => {
      return leaderboardData.value.filter(user => {
        const skillMatch = selectedSkill.value === 'All Skills' || user.focusSkill === selectedSkill.value || user.skills.includes(selectedSkill.value);
        const locationMatch = selectedLocation.value === 'Worldwide' || user.location === selectedLocation.value;
        return skillMatch && locationMatch;
      });
    });

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      console.log('Fetching global leaderboard...');
      isLoading.value = true;
      error.value = null;

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'));
        const querySnapshot = await getDocs(q);
        const leaderboard = [];

        for (const docSnap of querySnapshot.docs) {
          const userData = docSnap.data();
          leaderboard.push({
            id: docSnap.id,
            name: userData.name || 'Unknown',
            xp: userData.xp || 0,
            profilePicture: userData.profilePicture || null,
            focusSkill: userData.focusSkill || null,
            skills: userData.skills || [],
            location: userData.location || null,
            about: userData.about || null,
            social: userData.social || {},
          });
        }

        leaderboardData.value = leaderboard;
        console.log('Leaderboard data:', leaderboardData.value);

        if (leaderboard.length === 0) {
          error.value = 'No users found on the leaderboard. Be the first to join!';
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        error.value = 'Failed to load leaderboard. Please try again later.';
        showNotificationModal('Failed to load leaderboard.', 'error');
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch current user data (mocked for now, replace with actual auth user)
    const fetchCurrentUser = async () => {
      // Replace with actual auth user fetching logic
      currentUser.value = {
        profilePicture: 'https://via.placeholder.com/60',
        name: 'John Doe',
        location: 'USA',
        xp: 1500,
      };
    };

    // Fetch user profile for sidebar
    const fetchUserProfile = async (userId) => {
      console.log('Fetching profile for user:', userId);
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          selectedUser.value = { id: userSnap.id, ...userSnap.data() };
          showProfileSidebar.value = true;
          console.log('Selected user:', selectedUser.value);
        } else {
          console.error('User not found:', userId);
          showNotificationModal('User profile not found.', 'error');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        showNotificationModal('Failed to load user profile.', 'error');
      }
    };

    const showUserProfile = (user) => {
      fetchUserProfile(user.id);
    };

    const closeProfileSidebar = () => {
      showProfileSidebar.value = false;
      selectedUser.value = null;
    };

    const resetFilters = () => {
      selectedSkill.value = 'All Skills';
      selectedLocation.value = 'Worldwide';
    };

    const toggleSkills = (userId) => {
      expandedSkills.value[userId] = !expandedSkills.value[userId];
    };

    const getCountryFlag = (country) => {
      if (!country) return '';
      const countryCodeMap = {
        'USA': 'fi-us',
        'UK': 'fi-gb',
        'India': 'fi-in',
        'Brazil': 'fi-br',
        'Germany': 'fi-de',
      };
      return countryCodeMap[country] || '';
    };

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num;
    };

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

    onMounted(() => {
      fetchLeaderboard();
      fetchCurrentUser();
    });

    return {
      leaderboardData,
      filteredLeaderboard,
      selectedUser,
      showProfileSidebar,
      isLoading,
      error,
      showNotification,
      notificationMessage,
      notificationType,
      selectedSkill,
      selectedLocation,
      availableSkills,
      availableCountries,
      expandedSkills,
      currentUser,
      showUserProfile,
      closeProfileSidebar,
      resetFilters,
      toggleSkills,
      getCountryFlag,
      formatNumber,
      showNotificationModal,
      dismissNotification,
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

/* Slide-in Animation for Notification and Sidebar */
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

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Filter Section */
.filter-section select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}

/* User Preview */
.user-preview {
  background-color: #fff;
}

/* Leaderboard Table */
.leaderboard-table .grid-cols-5 {
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  .user-preview {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .user-preview .border-l {
    display: none;
  }
  .leaderboard-table .grid-cols-5 {
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  }
  .profile-sidebar {
    width: 100%;
  }
}
</style>