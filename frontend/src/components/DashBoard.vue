<template>
  <div class="dashboard-container font-lato">
    <!-- Sidebar -->
    <div
      :class="[
        'sidebar fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20',
        isSidebarExpanded ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Top Section -->
      <div class="p-4 flex items-center" :class="{ 'justify-center': !isSidebarExpanded }">
        <img
          :src="userProfilePicture"
          alt="Profile"
          class="w-9 h-9"
          :class="{ 'rounded-full': !isSidebarExpanded, 'rounded-md': isSidebarExpanded }"
        />
        <div v-if="isSidebarExpanded" class="ml-4 text-center">
          <div class="text-gray-800 font-semibold">{{ userName }}</div>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="flex flex-col flex-1 px-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors my-1 mx-2"
          :class="{
            'bg-gray-800 text-white hover:bg-gray-900': isActiveTab(item.path),
            'justify-center': !isSidebarExpanded
          }"
        >
          <component
            :is="item.icon"
            class="w-5 h-5"
            :class="[
      isSidebarExpanded ? 'w-5 h-5' : 'w-9 h-9', // Adjust icon size
      { 'mr-2': isSidebarExpanded }
    ]"
          />
          <span v-if="isSidebarExpanded">{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Bottom Section -->
      <div class="p-4">
        <router-link
          to="/dashboard/settings"
          class="flex items-center px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
          :class="{ 'justify-center': !isSidebarExpanded }"
        >
          <svg
            class="w-5 h-5"
            :class="{ 'mr-2': isSidebarExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span v-if="isSidebarExpanded">Settings</span>
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="main-content transition-all duration-300"
      :class="{ 'ml-64': isSidebarExpanded && !isMobile, 'ml-16': !isSidebarExpanded && !isMobile }"
    >
      <!-- Top Header -->
      <div class="top-header bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <button
            @click="toggleSidebar"
            class="text-gray-800 hover:text-gray-900 focus:outline-none"
          >
            <svg
              v-if="isSidebarExpanded"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <router-link
            to="/dashboard/stats"
            class="text-gray-800 hover:text-gray-900 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Stats
          </router-link>
          <button @click="toggleNotificationModal" class="text-gray-800 hover:text-gray-900 relative">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full px-1"
            >
              3
            </span>
          </button>
          <button @click="toggleProfileModal">
            <img
              :src="userProfilePicture"
              alt="Profile"
              class="w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </div>

      <!-- Notification Modal -->
      <div v-if="showNotificationModal" class="absolute top-16 right-6 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">Notifications</h3>
          <ul class="mt-2">
            <li class="py-2 text-gray-700">You completed a challenge!</li>
            <li class="py-2 text-gray-700">New course available: Vue Mastery</li>
            <li class="py-2 text-gray-700">You earned 50 XP!</li>
          </ul>
        </div>
      </div>

      <!-- Profile Modal -->
      <div v-if="showProfileModal" class="absolute top-16 right-6 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ userName }}</h3>
          <p class="text-gray-600">{{ userEmail }}</p>
          <ul class="mt-2">
            <li class="py-2 text-gray-700 hover:text-gray-900 cursor-pointer" @click="goToProfile">View Profile</li>
            <li class="py-2 text-gray-700 hover:text-gray-900 cursor-pointer" @click="goToSettings">Settings</li>
            <li class="py-2 text-gray-700 hover:text-gray-900 cursor-pointer" @click="logout">Logout</li>
          </ul>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area p-6">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loader"></div>
        </div>
        <router-view v-show="!isLoading"></router-view>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="slide">
      <div
        v-if="mobileMenuOpen"
        class="mobile-menu-overlay fixed inset-0 bg-transparent z-30"
      >
        <div
          class="mobile-menu w-64 h-full bg-white p-4 flex flex-col"
        >
          <!-- Top Section -->
          <div class="flex items-center">
            <img
              :src="userProfilePicture"
              alt="Profile"
              class="w-12 h-12 rounded-md"
            />
            <div class="ml-4 text-center">
              <div class="text-gray-800 font-semibold">{{ userName }}</div>
            </div>
          </div>

          <!-- Main Navigation -->
          <nav class="flex flex-col flex-1 px-2 mt-4">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors my-1"
              :class="{ 'bg-gray-800 text-white hover:bg-gray-900': isActiveTab(item.path) }"
              @click="toggleMobileMenu"
            >
              <component :is="item.icon" class="w-5 h-5 mr-2" />
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Bottom Section -->
          <div class="p-4">
            <router-link
              to="/dashboard/settings"
              class="flex items-center px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              @click="toggleMobileMenu"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { defineComponent, h } from 'vue';

const DashboardIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      }),
    ]);
  },
});

const BookIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253',
      }),
    ]);
  },
});

const BriefcaseIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      }),
    ]);
  },
});

const TrophyIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10H3v7h1v-7zm16 0h1v7h-1v-7z',
      }),
    ]);
  },
});

const UsersIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      }),
    ]);
  },
});

const CalendarIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      }),
    ]);
  },
});

const ChartBarIcon = defineComponent({
  render() {
    return h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      }),
    ]);
  },
});

export default {
  name: 'DashBoard',
  data() {
    return {
      isSidebarExpanded: true,
      mobileMenuOpen: false,
      userName: '',
      userEmail: '',
      userProfilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', // Fallback
      isLoading: false,
      showNotificationModal: false,
      showProfileModal: false,
      navItems: [
        { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
        { name: 'My Courses', path: '/dashboard/course', icon: BookIcon },
        { name: 'Job Search', path: '/dashboard/jobs', icon: BriefcaseIcon },
        { name: 'Challenges', path: '/dashboard/challenges', icon: TrophyIcon },
        { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: UsersIcon },
        { name: 'Events', path: '/dashboard/events', icon: CalendarIcon },
        { name: 'Analytics', path: '/dashboard/analytics', icon: ChartBarIcon },
      ],
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    },
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (oldVal && newVal.path !== oldVal.path) {
          this.isLoading = true;
        }
      },
      immediate: true,
    },
  },
  updated() {
    this.isLoading = false;
  },
  methods: {
    isActiveTab(path) {
      // Exact match for '/dashboard'
      if (path === '/dashboard') {
        return this.$route.path === '/dashboard';
      }
      // For other tabs, check if the path matches exactly (but not the parent '/dashboard')
      return this.$route.path === path;
    },
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      if (this.isMobile) {
        this.mobileMenuOpen = !this.mobileMenuOpen;
      }
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    toggleNotificationModal() {
      this.showNotificationModal = !this.showNotificationModal;
      this.showProfileModal = false; // Close profile modal if open
    },
    toggleProfileModal() {
      this.showProfileModal = !this.showProfileModal;
      this.showNotificationModal = false; // Close notification modal if open
    },
    goToProfile() {
      this.$router.push('/dashboard/profile');
      this.showProfileModal = false;
    },
    goToSettings() {
      this.$router.push('/dashboard/settings');
      this.showProfileModal = false;
    },
    async logout() {
      const auth = getAuth();
      await auth.signOut();
      this.$router.push('/signin');
    },
    async fetchUserProfile() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.userName = user.displayName || 'User';
        this.userEmail = user.email || '';
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          this.userProfilePicture = data.profilePictureBase64 || this.userProfilePicture;
        }
        getDoc(userDocRef).then((userDoc) => {
      if (userDoc.exists() && !userDoc.data().onboardingComplete) {
        this.$router.push('/onboarding');
      }
        });
      } else {
        this.$router.push('/signin');
      }
    },
  },
  created() {
    this.fetchUserProfile();
    this.isSidebarExpanded = !this.isMobile;
    this.mobileMenuOpen = false;
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.isSidebarExpanded = false;
        this.mobileMenuOpen = false;
      } else {
        this.isSidebarExpanded = true;
        this.mobileMenuOpen = false;
      }
    });
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

.font-lato {
  font-family: 'Lato', sans-serif;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f7fafc;
}

/* Sidebar Styles */
.sidebar {
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 64px; /* Default collapsed width */
  }
  .sidebar-expanded {
    transform: translateX(0);
    width: 256px; /* Expanded width */
  }
  .mobile-menu-overlay .mobile-menu {
    transform: translateX(0);
  }
  .mobile-menu-overlay {
    background: transparent !important; /* Remove black background */
  }
}

/* Main Content */
.main-content {
  flex: 1;
  background: #f7fafc;
}

/* Content Area */
.content-area {
  padding: 24px;
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  transition: opacity 0.3s ease;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fe572a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
  .sidebar {
    width: 64px;
  }
  .sidebar-expanded {
    width: 256px;
  }
}
</style>