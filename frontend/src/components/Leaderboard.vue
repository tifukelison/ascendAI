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
            :src="topUser.profilePictureBase64 || 'https://via.placeholder.com/60'"
            alt="User Profile"
            class="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
          />
          <div>
            <p class="font-lato font-bold text-gray-800">{{ topUser.name || 'User' }}</p>
            <p class="font-lato text-sm text-gray-600 flex items-center">
              <span class="fi mr-2" :class="getCountryFlag(topUser.location)"></span>
              {{ topUser.location || 'N/A' }}
            </p>
          </div>
        </div>
        <div class="border-l border-gray-200 h-12 hidden sm:block"></div>
        <div class="text-center">
          <p class="font-lato text-gray-800">XP</p>
          <p class="font-lato font-bold text-[#fe572a]">{{ topUser.xp || 0 }}</p>
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
      <div v-else-if="!isLoading && paginatedLeaderboard.length === 0" class="p-6 rounded-lg border border-gray-200 shadow-sm mb-8 text-center">
        <p class="font-lato text-gray-600">No users found on the leaderboard. Be the first to join!</p>
      </div>

      <!-- Leaderboard Table -->
      <div v-else class="leaderboard-table p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="grid grid-cols-6 gap-4 font-lato font-bold text-gray-800 mb-4">
          <div>Ranking</div>
          <div class="col-span-2">Profile</div>
          <div>Country</div>
          <div>Skills</div>
          <div>XP</div>
        </div>
        <div
          v-for="(user, index) in paginatedLeaderboard"
          :key="user.id"
          class="grid grid-cols-6 gap-4 items-center p-4 rounded-lg"
          :class="{ 'bg-gray-50': index % 2 === 0, 'bg-white': index % 2 !== 0, 'hover:bg-gray-100 cursor-pointer': true }"
          @click="showUserProfile(user)"
        >
          <!-- Ranking -->
          <div class="flex items-center">
            <span v-if="index === 0" class="fas fa-medal text-yellow-400 mr-2"></span>
            <span v-else-if="index === 1" class="fas fa-medal text-gray-400 mr-2"></span>
            <span v-else-if="index === 2" class="fas fa-medal text-orange-400 mr-2"></span>
            <span v-else class="font-lato text-gray-800">#{{ index + 1 + (currentPage - 1) * itemsPerPage }}</span>
          </div>

          <!-- Profile -->
          <div class="col-span-2 flex items-center gap-4">
            <img
              :src="user.profilePictureBase64 || 'https://via.placeholder.com/40'"
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

          <!-- Skills -->
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="skill in user.skills"
              :key="skill"
              class="bg-[#fe572a] text-white font-lato text-xs px-2 py-1 rounded-full"
            >
              {{ skill }}
            </span>
          </div>

          <!-- XP -->
          <div class="text-center">
            <p class="font-lato text-gray-800">{{ user.xp }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center mt-6">
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
              :src="selectedUser.profilePictureBase64 || 'https://via.placeholder.com/80'"
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
    <span v-if="selectedUser.social?.twitterFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.twitterFollowers) }}</span>
  </a>
  <a
    v-if="selectedUser.social?.linkedin"
    :href="selectedUser.social.linkedin"
    target="_blank"
    class="text-gray-600 hover:text-[#fe572a]"
  >
    <i class="fab fa-linkedin text-xl"></i>
    <span v-if="selectedUser.social?.linkedinFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.linkedinFollowers) }}</span>
  </a>
  <a
    v-if="selectedUser.social?.github"
    :href="selectedUser.social.github"
    target="_blank"
    class="text-gray-600 hover:text-[#fe572a]"
  >
    <i class="fab fa-github text-xl"></i>
    <span v-if="selectedUser.social?.githubFollowers" class="ml-1 text-xs">{{ formatNumber(selectedUser.social.githubFollowers) }}</span>
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
      profilePictureBase64: null,
      name: 'User',
      location: null,
      xp: 0,
    });
    const topUser = ref({});

    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = ref(10); // Define and initialize itemsPerPage

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

    // Paginated leaderboard
    const paginatedLeaderboard = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredLeaderboard.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredLeaderboard.value.length / itemsPerPage.value);
    });

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
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
            profilePictureBase64: userData.profilePictureBase64 || null,
            focusSkill: userData.focusSkill || null,
            skills: userData.skills || [],
            location: userData.location || null,
            about: userData.about || null,
            social: userData.social || {},
          });
        }

        leaderboardData.value = leaderboard;
        topUser.value = leaderboard[0] || {};

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
        profilePictureBase64: 'https://via.placeholder.com/60',
        name: 'John Doe',
        location: 'USA',
        xp: 1500,
      };
    };

    // Fetch user profile for sidebar
    const fetchUserProfile = async (userId) => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          selectedUser.value = { id: userSnap.id, ...userSnap.data() };
          showProfileSidebar.value = true;
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

    onMounted(() => {
      fetchLeaderboard();
      fetchCurrentUser();
    });

    return {
      leaderboardData,
      filteredLeaderboard,
      paginatedLeaderboard,
      totalPages,
      currentPage,
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
      topUser,
      showUserProfile,
      closeProfileSidebar,
      resetFilters,
      toggleSkills,
      getCountryFlag,
      formatNumber,
      showNotificationModal,
      dismissNotification,
      prevPage,
      nextPage,
      itemsPerPage, // Ensure itemsPerPage is returned
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
.leaderboard-table .grid-cols-6 {
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
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
  .leaderboard-table .grid-cols-6 {
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  }
  .profile-sidebar {
    width: 100%;
  }
}
</style>