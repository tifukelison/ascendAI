
<template>
  <div :class="['min-h-screen flex flex-col relative', isDarkMode ? 'bg-[#0a0b0b]' : 'bg-white']">
    <!-- Background Grid -->
    <div :class="['absolute inset-0 pointer-events-none z-0 opacity-70', isDarkMode ? 'bg-grid-pattern-dark' : 'bg-grid-pattern']"></div>

    <!-- Navigation Bar -->
    <header
      :class="['border-b py-4 px-6 md:px-12 sticky top-0 backdrop-blur-sm z-50', isDarkMode ? 'bg-black/90 border-gray-700' : 'bg-white/90 border-gray-200/80']"
    >
      <nav class="flex items-center justify-between">
        <!-- Logo -->
        <div class="font-crimson-pro text-2xl font-bold tracking-tight">
          <img :src="isDarkMode ? logos.dark : logos.light" alt="Ascendia" class="h-5" />
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            :class="['font-lato font-bold transition-colors duration-200', isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900']"
            >Home</router-link
          >
          <router-link
            to="/about"
            :class="['font-lato font-bold transition-colors duration-200', isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900']"
            >About</router-link
          >
          <router-link
            to="/contact"
            :class="['font-lato font-bold transition-colors duration-200', isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-600 hover:text-gray-900']"
            >Contact</router-link
          >
          <router-link
            to="/signup"
            class="font-lato font-bold bg-[#fe572a] text-white px-4 py-2 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
            >Get Started</router-link
          >
        </div>

        <!-- Dark Mode Toggle and Mobile Menu Button -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="focus:outline-none">
            <i v-if="isDarkMode" class="fas fa-sun w-6 h-6 text-white"></i>
            <i v-else class="fas fa-moon w-6 h-6 text-gray-600"></i>
          </button>

          <!-- Mobile Menu Button -->
          <button @click="toggleMenu" class="md:hidden focus:outline-none">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20"
                :stroke="isDarkMode ? '#FFFFFF' : '#1F2937'"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M4 12H14"
                :stroke="isDarkMode ? '#FFFFFF' : '#1F2937'"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M4 18H20"
                :stroke="isDarkMode ? '#FFFFFF' : '#1F2937'"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-if="isMenuOpen" class="md:hidden mt-4 space-y-3 pb-3">
          <router-link
            to="/"
            :class="['block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200', isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50']"
            @click="isMenuOpen = false"
            >Home</router-link
          >
          <router-link
            to="/about"
            :class="['block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200', isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50']"
            @click="isMenuOpen = false"
            >About</router-link
          >
          <router-link
            to="/contact"
            :class="['block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200', isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50']"
            @click="isMenuOpen = false"
            >Contact</router-link
          >
          
          <router-link
            to="/signup"
            class="block font-lato font-bold bg-[#fe572a] text-white px-4 py-2 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200 text-center"
            @click="isMenuOpen = false"
            >Get Started</router-link
          >
        </div>
      </transition>
    </header>

    <!-- Hero Section -->
    <section
      :class="['flex items-center justify-center px-6 md:px-12 py-10 md:py-32 relative z-10 section', isDarkMode ? 'text-white' : 'text-black']"
    >
      <div class="max-w-3xl text-center">
        <h1
          class="font-crimson-pro text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#fe572a] to-[#ff8c63] bg-clip-text text-transparent cursor-pointer"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
        >
        Every Dawn Na Battle. Your Weapon? Your Skills.
        </h1>
        <p
          :class="['font-lato text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed', isDarkMode ? 'text-gray-300' : 'text-gray-600']"
        >
        No more scattered tasks. Every morning, Ascendia drops one AI-made challenge for you. You finish am. You collect XP. You climb leaderboard. Show now say you serious.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            to="/signup"
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
            >Get Started</router-link
          >
          <router-link
            to="/about"
            :class="['font-lato font-bold border-2 px-6 py-3 rounded-lg hover:-translate-y-1 transition-all duration-200', isDarkMode ? 'border-white text-white hover:bg-gray-800' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-gray-100']"
            >Learn More →</router-link
          >
        </div>
        <p :class="['text-sm mt-4', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Join 10+ achievers</p>

        <!-- Tooltip -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="showTooltip"
            class="absolute top-0 left-1/2 transform -translate-x-1/2  translate-y-full mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg z-[60]"
          >
            Yeah, it’s that good. 🌟
            <div
              class="absolute bottom-0 left-1/2 w-2 h-2 bg-gray-900 transform -translate-x-1/2 translate-y-1/2 rotate-45"
            ></div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Benefits Section -->
    <section :class="['py-10 px-6 md:px-12 relative z-10 section', isDarkMode ? 'text-white' : 'text-black']">
      <div class="max-w-5xl mx-auto">
        <h2
          :class="['text-5xl md:text-4xl font-crimson-pro font-bold text-center mb-7', isDarkMode ? 'text-white' : 'text-gray-800']"
        >
        Benefits (Wetin You Go Smash)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div :class="['text-center p-6 rounded-xl shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <h3 class="text-xl font-bold mb-2">Rule Your Day</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              One clear mission na im. No wahala.
            </p>
          </div>
          <div :class="['text-center p-6 rounded-xl shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <h3 class="text-xl font-bold mb-2">Level Up Fast</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Swap boring course for gamified quest— you learn by action.
            </p>
          </div>
          <div :class="['text-center p-6 rounded-xl shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <h3 class="text-xl font-bold mb-2">Show Face</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              AI feedback sharp-sharp, leaderboard hot— make dem see you.
            </p>
          </div>
          <div :class="['text-center p-6 rounded-xl shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <h3 class="text-xl font-bold mb-2">Crew Vibes</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Link up, share war-stories, rise as one.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section :class="['py-16 px-6 md:px-12 relative z-10 section', isDarkMode ? 'text-white' : 'text-black']">
      <div class="max-w-5xl mx-auto">
        <h2
          :class="['text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12', isDarkMode ? 'text-white' : 'text-gray-800']"
        >
        How E Dey Work
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 relative before:absolute before:inset-0 before:h-0.5 before:bg-gray-200 before:top-1/2 before:-translate-y-1/2 before:md:block before:hidden"
        >
          <div
            :class="['p-6 rounded-xl shadow-sm text-center relative z-10', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              1
            </div>
            <h3 class="text-xl font-bold mb-2">Onboard</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Yarn us your skills, focus, and gbosa (ambition).
            </p>
          </div>
          <div
            :class="['p-6 rounded-xl shadow-sm text-center relative z-10', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              2
            </div>
            <h3 class="text-xl font-bold mb-2">Daily Duel</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Grab your AI-forged challenge of the day.
            </p>
          </div>
          <div
            :class="['p-6 rounded-xl shadow-sm text-center relative z-10', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              3
            </div>
            <h3 class="text-xl font-bold mb-2">Crush & Climb</h3>
            <p :class="['font-lato text-base', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Submit, collect XP, jump leaderboard— na so e dey go.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section :class="['py-16 px-6 md:px-12 bg-gray-50 relative z-10 section', isDarkMode ? 'bg-gray-900' : 'bg-gray-50']">
      <div class="max-w-5xl mx-auto">
        <h2
          :class="['text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12', isDarkMode ? 'text-white' : 'text-gray-800']"
        >
        Got Questions? We've Got Answers.
        </h2>
        <div class="space-y-4">
          <details :class="['p-4 rounded-lg shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <summary :class="['font-lato font-bold text-lg cursor-pointer', isDarkMode ? 'text-white' : 'text-black']">
              How often can I get a new challenge?
            </summary>
            <p :class="['font-lato text-base mt-2', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Daily, weekly, or whenever you’re ready to tackle something new. Your call, hero.
            </p>
          </details>
          <details :class="['p-4 rounded-lg shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <summary :class="['font-lato font-bold text-lg cursor-pointer', isDarkMode ? 'text-white' : 'text-black']">
              Is there a free option?
            </summary>
            <p :class="['font-lato text-base mt-2', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Yep, start with basic challenges and community access, no cost. No cap, this is the best thing since sliced bread (and we’re not even bread)!
            </p>
          </details>
          <details :class="['p-4 rounded-lg shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <summary :class="['font-lato font-bold text-lg cursor-pointer', isDarkMode ? 'text-white' : 'text-black']">
              Can I connect with mentors?
            </summary>
            <p :class="['font-lato text-base mt-2', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Absolutely, our community hooks you up with mentors to guide you. Like a wise sage, but cooler.
            </p>
          </details>
          <details :class="['p-4 rounded-lg shadow-sm', isDarkMode ? 'bg-black text-white light-shadow' : 'bg-white']">
            <summary :class="['font-lato font-bold text-lg cursor-pointer', isDarkMode ? 'text-white' : 'text-black']">
              What’s the deal with live battles?
            </summary>
            <p :class="['font-lato text-base mt-2', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
              Compete live against others to earn XP and climb the leaderboard. If you’re waiting for a sign, this is it. Literally.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- Footer / Final CTA -->
    <footer :class="['py-10 px-6 md:px-12 relative z-10', isDarkMode ? 'bg-black text-white' : 'bg-[#1b1b1b] text-white']">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-crimson-pro font-bold mb-6">
          Ready to Level Up?
        </h2>
        <p :class="['font-lato text-base mb-6', isDarkMode ? 'text-gray-400' : 'text-gray-300']">
          Drop your email to join the crew crushing it. Your adventure awaits. 🌟
        </p>
        <div class="flex justify-center gap-4 mb-8 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            :class="['font-lato px-4 py-3 rounded-lg w-full', isDarkMode ? 'text-gray-600 bg-gray-800' : 'text-gray-600']"
          />
          <button
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
          >
            Subscribe
          </button>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <a href="#" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"><i class="fab fa-twitter"></i></a>
          <a href="#" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"><i class="fab fa-facebook"></i></a>
          <a href="#" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"><i class="fab fa-instagram"></i></a>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <router-link to="/about" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"
            >About</router-link
          >
          <router-link to="/blog" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"
            >Blog</router-link
          >
          <router-link to="/privacy" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"
            >Privacy</router-link
          >
          <router-link to="/terms" :class="['hover:text-[#fe572a]', isDarkMode ? 'text-gray-400' : 'text-gray-300']"
            >Terms</router-link
          >
        </div>
        <p :class="['font-lato text-sm', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
          © 2025 Ascendia. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import logo from '../assets/logo.png';
import logo2 from '../assets/logo-2.png';
import Contact from './Contact.vue'; // Import the Contact component

export default {
  name: "LandingPage",
  components: {
    Contact, // Register the Contact component
  },
  data() {
    return {
      isMenuOpen: false,
      showTooltip: false,
      billing: "monthly",
      isDarkMode: true,
      logos: {
        light: logo,
        dark: logo2
      }
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
  },
  mounted() {
    // Scroll animation observer
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((section) => observer.observe(section));
  },
};
</script>

<style scoped>
/* Background Grid Pattern */
.bg-grid-pattern {
  background-image: radial-gradient(circle, #f0b5a4 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-grid-pattern-dark {
  background-image: radial-gradient(circle, #333333 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Scroll Animation */
.section {
  /* opacity: 0; */
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.section.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Font Awesome for Icons */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

/* Responsive Typography */
@media (max-width: 640px) {
  .text-6xl {
    font-size: 2.5rem;
  }
  .text-4xl {
    font-size: 1.875rem;
  }
  .text-3xl {
    font-size: 1.5rem;
  }
}

/* Custom Fonts */
.font-lato {
  font-family: "Lato", sans-serif;
}

.font-crimson-pro {
  font-family: "Crimson Pro", serif;
}
.font-crimson-pro-italic {
  font-family: "CrimsonProItalic";
}

/* Light Shadow for Dark Mode */
.light-shadow {
  box-shadow: 0 2px 0px -5px rgba(254, 88, 42, 0.514), 0 2px 3px -2px rgba(254, 88, 42, 0.808);
}
</style>
