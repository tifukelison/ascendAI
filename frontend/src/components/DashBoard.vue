<template>
  <div class="dashboard-container" :class="{ 'dark-mode': darkMode }">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="app-brand">SkillHub Pro</div>
      
      <nav class="sidebar-menu">
        <router-link class="menu-item" :class="{ 'active': $route.path === '/dashboard' }" to="/dashboard">
          <i class="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </router-link>
        
        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/course') }" to="/dashboard/course">
          <i class="fas fa-book-open"></i>
          <span>My Courses</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/jobs') }" to="/dashboard/jobs">
          <i class="fas fa-briefcase"></i>
          <span>Job Search</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/challenges') }" to="/dashboard/challenges">
          <i class="fas fa-trophy"></i>
          <span>Challenges</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/community') }" to="/dashboard/community">
          <i class="fas fa-users"></i>
          <span>Community</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/resources') }" to="/dashboard/resources">
          <i class="fas fa-file-alt"></i>
          <span>Resources</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/events') }" to="/dashboard/events">
          <i class="fas fa-calendar-alt"></i>
          <span>Events</span>
        </router-link>

        <router-link class="menu-item" :class="{ 'active': $route.path.includes('/analytics') }" to="/dashboard/analytics">
          <i class="fas fa-chart-pie"></i>
          <span>Analytics</span>
        </router-link>
      </nav>

      <!-- User Profile Section -->
      <div class="user-profile">
        <img src="../assets/profile-placeholder.jpeg" alt="Profile" class="profile-pic">
        <div class="user-info">
          <div class="username">{{ userName }}</div>
          <div class="user-status">Pro Member</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Header -->
      <div class="top-header">
        <div class="header-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="breadcrumb">Dashboard / {{ currentPageTitle }}</div>
        </div>
        <div class="header-controls">
          <button class="notification-btn">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </button>
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loader"></div>
        </div>
        <router-view v-show="!isLoading"></router-view>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        <div class="mobile-menu">
          <div class="mobile-menu-header">
            <div class="app-brand">SkillHub Pro</div>
            <button class="close-btn" @click="toggleMobileMenu">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <nav class="mobile-menu-items">
             <router-link class="menu-item" :class="{ 'active': $route.path === '/dashboard' }" to="/dashboard" @click.native="toggleMobileMenu">
              <i class="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </router-link>
            <router-link class="menu-item" :class="{ 'active': $route.path.includes('/course') }" to="/dashboard/course" @click.native="toggleMobileMenu">
              <i class="fas fa-book-open"></i>
              <span>My Courses</span>
            </router-link>
            <router-link class="menu-item" :class="{ 'active': $route.path.includes('/jobs') }" to="/dashboard/jobs" @click.native="toggleMobileMenu">
              <i class="fas fa-briefcase"></i>
              <span>Job Search</span>
            </router-link>
            <router-link class="menu-item" :class="{ 'active': $route.path.includes('/challenges') }" to="/dashboard/challenges" @click.native="toggleMobileMenu">
              <i class="fas fa-trophy"></i>
              <span>Challenges</span>
            </router-link>
            <router-link class="menu-item" :class="{ 'active': $route.path.includes('/community') }" to="/dashboard/community" @click.native="toggleMobileMenu">
              <i class="fas fa-users"></i>
              <span>Community</span>
            </router-link>
             <router-link class="menu-item" :class="{ 'active': $route.path.includes('/resources') }" to="/dashboard/resources" @click.native="toggleMobileMenu">
              <i class="fas fa-file-alt"></i>
              <span>Resources</span>
            </router-link>
            <!-- Repeat router-links from sidebar -->
          </nav>
          <div class="user-profile-mobile">
            <img src="../assets/profile-placeholder.jpeg" alt="Profile" class="profile-pic">
            <div class="user-info">
              <div class="username">{{ userName }}</div>
              <div class="user-status">Pro Member</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-toggle" @click="toggleMobileMenu">
      <i class="fas fa-bars"></i>
    </button>
  </div>
</template>

<script>
import { getAuth } from "../firebase";

export default {
  name: 'DashBoard',
  data() {
    return {
      darkMode: false,
      mobileMenuOpen: false,
      userName: '',
      pageTitles: {
        '/dashboard': 'My Dashboard',
        '/dashboard/courses': 'My Courses',
        '/dashboard/jobs': 'Job Search',
        '/dashboard/challenges': 'Challenges',
        '/dashboard/community': 'Community',
        '/dashboard/resources': 'Resources',
        '/dashboard/events': 'Events',
        '/dashboard/analytics': 'Analytics'
      },
      isLoading: false
    }
  },
  computed: {
    currentPageTitle() {
      return this.pageTitles[this.$route.path] || 'Dashboard';
    }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (oldVal && newVal.path !== oldVal.path) {
          this.isLoading = true
          console.log("showing loader")
        }
      },
      immediate: true
    }
  },
  updated() {
    // Hide loader after component updates
    this.isLoading = false
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    }
  },
  created() {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      this.userName = user.displayName || 'User'
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #faf9f5;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  background: #22252a;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e4e4;
}

.app-brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  padding-bottom: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #34495e;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 12px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 500;
}

.menu-item i {
  width: 20px;
  font-size: 0.9rem;
}

/* User Profile */
.user-profile {
  padding: 16px;
  margin-top: auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  line-height: 1.4;
}

.username {
  font-size: 0.9rem;
  color: #fff;
}

.user-status {
  font-size: 0.75rem;
  color: #7f8c8d;
}

/* Main Content */
.main-content {
  flex: 1;
  background: #faf9f5;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #22252a;
}

.breadcrumb {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.header-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.notification-btn,
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e4e4e4;
  color: #22252a;
  transition: all 0.2s ease;
}

.notification-btn:hover,
.theme-toggle:hover {
  background: #f5f5f5;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 0.7rem;
}

/* Content Area */
.content-area {
  padding: 24px 32px;
}

/* Mobile Menu */
.mobile-menu-toggle{
  display: none;
}
.mobile-menu-overlay {
  position: fixed; 
  top: 0; 
  left: 0; 
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  width: 100%;
  height: 100vh;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #fff;
  padding: 24px;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e4e4;
  margin-bottom: 10px;
}

.mobile-menu-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Dark Mode */
.dark-mode {
  background: #22252a;
  color: #fff;
}

.dark-mode .main-content {
  background: #22252a;
}

.dark-mode .top-header {
  background: #2d2d2d;
  border-color: #404040;
}

.dark-mode .page-title {
  color: #fff;
}

.dark-mode .notification-btn,
.dark-mode .theme-toggle {
  background: #404040;
  border-color: #505050;
  color: #fff;
}

/* Transitions */
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

.dark-mode .loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .top-header {
    padding: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .mobile-menu-toggle {
    display: block;
  }  
}
</style>