<template>
  <div class="min-h-screen flex flex-col bg-white relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70"></div>

    <!-- Navigation Bar -->
    <header
      class="border-b border-gray-200/80 py-4 px-6 md:px-12 sticky top-0 bg-white/90 backdrop-blur-sm z-50"
    >
      <nav class="flex items-center justify-between">
        <!-- Logo -->
        <div class="font-crimson-pro text-2xl font-bold tracking-tight">
          <img src="../assets/logo.png" alt="Ascendia" class="h-5" />
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="font-lato font-bold text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >Home</router-link
          >
          <router-link
            to="/about"
            class="font-lato font-bold text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >About</router-link
          >
          <router-link
            to="/contact"
            class="font-lato font-bold text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >Contact</router-link
          >
          <router-link
            to="/signup"
            class="font-lato font-bold bg-[#fe572a] text-white px-4 py-2 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
            >Get Started</router-link
          >
        </div>

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
              stroke="#1F2937"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M4 12H14"
              stroke="#1F2937"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
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
            class="block font-lato font-bold text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors duration-200"
            @click="isMenuOpen = false"
            >Home</router-link
          >
          <router-link
            to="/about"
            class="block font-lato font-bold text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors duration-200"
            @click="isMenuOpen = false"
            >About</router-link
          >
          <router-link
            to="/contact"
            class="block font-lato font-bold text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded hover:bg-gray-50 transition-colors duration-200"
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
    <!-- Hero Section -->
<section
  class="flex items-center justify-center px-6 md:px-12 py-20 md:py-32 relative z-10 section"
>
  <div class="max-w-3xl text-center">
    <h1
      class="font-crimson-pro text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#fe572a] to-[#ff8c63] bg-clip-text text-transparent cursor-pointer"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
    Rome was not built in a month. But your <span class="font-crimson-pro-italic text-[#212121]">skill</span> can be.
    </h1>
    <p
      class="font-lato text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
    >
      You'll get personalized challenges, so you earn XP, and climb the leaderboard to show
      the world what you’re made of.
    </p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <router-link
        to="/signup"
        class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
        >Get Started</router-link
      >
      <router-link
        to="/about"
        class="font-lato font-bold border-2 border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 rounded-lg hover:bg-gray-100 hover:-translate-y-1 transition-all duration-200"
        >Learn More →</router-link
      >
    </div>
    <p class="text-sm text-gray-500 mt-4">Join the achievers</p>

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
        Yeah, it’s that good.
        <div
          class="absolute bottom-0 left-1/2 w-2 h-2 bg-gray-900 transform -translate-x-1/2 translate-y-1/2 rotate-45"
        ></div>
      </div>
    </transition>
  </div>
</section>

    <!-- Problems We Solve Section -->
    <section class="py-16 px-6 md:px-12 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          Sound like you? That's why we built this.
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <i class="fas fa-tasks text-[#fe572a] text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Tasks All Over?</h3>
            <p class="text-gray-600 font-lato text-base">
              Centralize your goals with one daily challenge.
            </p>
          </div>
          <div class="text-center">
            <i class="fas fa-book text-[#fe572a] text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Bored of Courses?</h3>
            <p class="text-gray-600 font-lato text-base">
              Swap dull lessons for gamified challenges.
            </p>
          </div>
          <div class="text-center">
            <i class="fas fa-comment text-[#fe572a] text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Fake Feedback?</h3>
            <p class="text-gray-600 font-lato text-base">
              Get instant AI reviews to keep you on track.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features Section -->
    <section class="py-16 px-6 md:px-12 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          What You’ll Crush
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            class="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <h3
              class="text-[#fe572a] font-crimson-pro font-bold text-xl mb-3"
            >
              Daily Challenges
            </h3>
            <p class="text-gray-600 font-lato text-base">
              You'll get personalized tasks that match your skill and push you
              toward your goal.
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <h3
              class="text-[#fe572a] font-crimson-pro font-bold text-xl mb-3"
            >
              Live Battles & Events
            </h3>
            <p class="text-gray-600 font-lato text-base">
              You'll go head-to-head with others in the leaderboard to show off your talent.
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <h3
              class="text-[#fe572a] font-crimson-pro font-bold text-xl mb-3"
            >
              Progression & Rewards
            </h3>
            <p class="text-gray-600 font-lato text-base">
              Earn XP, track streaks, and unlock achievements that scream
              progress.
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <h3
              class="text-[#fe572a] font-crimson-pro font-bold text-xl mb-3"
            >
              Community & Mentorship
            </h3>
            <p class="text-gray-600 font-lato text-base">
              Connect with learners and build a crew that keeps you moving forward.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section (3-Step Flow) -->
    <section class="py-16 px-6 md:px-12 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          How You’ll Get There
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 relative before:absolute before:inset-0 before:h-0.5 before:bg-gray-200 before:top-1/2 before:-translate-y-1/2 before:md:block before:hidden"
        >
          <div
            class="bg-white p-6 rounded-xl shadow-sm text-center relative z-10"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              1
            </div>
            <h3 class="text-xl font-bold mb-2">Onboard</h3>
            <p class="text-gray-600 font-lato text-base">
              Tell us about you and your goals.
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm text-center relative z-10"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              2
            </div>
            <h3 class="text-xl font-bold mb-2">Get Your Daily Challenge</h3>
            <p class="text-gray-600 font-lato text-base">
              One AI-crafted task to push you forward.
            </p>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm text-center relative z-10"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-xl font-bold"
            >
              3
            </div>
            <h3 class="text-xl font-bold mb-2">Crush & Track</h3>
            <p class="text-gray-600 font-lato text-base">
              Submit, earn XP, and climb the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
 <!--   <section class="py-16 px-6 md:px-12 bg-gray-50 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          What Others Are Saying
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <img
              src="https://via.placeholder.com/80"
              alt="User"
              class="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p class="text-gray-600 font-lato text-base italic">
              "This app is legit. Got me a job in 3 months."
            </p>
            <p class="font-lato font-bold text-sm mt-2">
              John Doe, Software Engineer
            </p>
          </div>
          <div class="text-center">
            <img
              src="https://via.placeholder.com/80"
              alt="User"
              class="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p class="text-gray-600 font-lato text-base italic">
              "The challenges keep me hooked, and the leaderboard? Fire."
            </p>
            <p class="font-lato font-bold text-sm mt-2">
              Jane Smith, Designer
            </p>
          </div>
          <div class="text-center">
            <img
              src="https://via.placeholder.com/80"
              alt="User"
              class="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p class="text-gray-600 font-lato text-base italic">
              "Finally, learning that doesn’t feel like a chore."
            </p>
            <p class="font-lato font-bold text-sm mt-2">
              Alex Lee, Marketer
            </p>
          </div>
        </div>
        <div class="flex justify-center gap-8 mt-12">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">85%</p>
            <p class="text-gray-600 font-lato text-base">
              Daily Completion Rate
            </p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">4.8★</p>
            <p class="text-gray-600 font-lato text-base">Average Rating</p>
          </div>
        </div>
      </div>
    </section>

    
    <section class="py-16 px-6 md:px-12 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          Pick Your Plan
        </h2>
        <div class="flex justify-center gap-4 mb-8">
          <button
            :class="{ 'bg-[#fe572a] text-white': billing === 'monthly', 'bg-gray-200 text-gray-600': billing !== 'monthly' }"
            class="font-lato font-bold px-4 py-2 rounded-lg"
            @click="billing = 'monthly'"
          >
            Monthly
          </button>
          <button
            :class="{ 'bg-[#fe572a] text-white': billing === 'annual', 'bg-gray-200 text-gray-600': billing !== 'annual' }"
            class="font-lato font-bold px-4 py-2 rounded-lg"
            @click="billing = 'annual'"
          >
            Annual
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            class="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent"
          >
            <h3 class="text-xl font-bold mb-2">Free</h3>
            <p class="text-4xl font-bold mb-4">$0</p>
            <p class="text-gray-600 font-lato text-base mb-4">
              Basic daily challenges and community access.
            </p>
            <router-link
              to="/signup"
              class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 block text-center"
              >Start Free</router-link
            >
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-sm border-2 border-[#fe572a]"
          >
            <h3 class="text-xl font-bold mb-2">Pro</h3>
            <p class="text-4xl font-bold mb-4">
              {{ billing === "monthly" ? "$9.99/month" : "$99/year" }}
            </p>
            <p class="text-gray-600 font-lato text-base mb-4">
              AI-mentor chat, advanced analytics, premium events.
            </p>
            <router-link
              to="/signup"
              class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 block text-center"
              >Upgrade Now</router-link
            >
          </div>
        </div>
      </div>
    </section>-->

    <!-- FAQ Section -->
    <section class="py-16 px-6 md:px-12 bg-gray-50 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800"
        >
          Got Questions?
        </h2>
        <div class="space-y-4">
          <details class="bg-white p-4 rounded-lg shadow-sm">
            <summary class="font-lato font-bold text-lg cursor-pointer">
              How often can I get a new challenge?
            </summary>
            <p class="text-gray-600 font-lato text-base mt-2">
              Daily, weekly, or whenever you’re ready to tackle something new.
            </p>
          </details>
          <details class="bg-white p-4 rounded-lg shadow-sm">
            <summary class="font-lato font-bold text-lg cursor-pointer">
              Is there a free option?
            </summary>
            <p class="text-gray-600 font-lato text-base mt-2">
              Yep, start with basic challenges and community access, no cost.
            </p>
          </details>
          <details class="bg-white p-4 rounded-lg shadow-sm">
            <summary class="font-lato font-bold text-lg cursor-pointer">
              Can I connect with mentors?
            </summary>
            <p class="text-gray-600 font-lato text-base mt-2">
              Absolutely, our community hooks you up with mentors to guide you.
            </p>
          </details>
          <details class="bg-white p-4 rounded-lg shadow-sm">
            <summary class="font-lato font-bold text-lg cursor-pointer">
              What’s the deal with live battles?
            </summary>
            <p class="text-gray-600 font-lato text-base mt-2">
              Compete live against others to earn XP and climb the leaderboard.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- Footer / Final CTA -->
    <footer class="py-10 px-6 md:px-12 bg-[#1b1b1b] text-white relative z-10">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-crimson-pro font-bold mb-6">
          Ready to Level Up?
        </h2>
        <p class="text-gray-300 font-lato text-base mb-6">
          Drop your email to join the crew crushing it.
        </p>
        <div class="flex justify-center gap-4 mb-8 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            class="font-lato text-gray-600 px-4 py-3 rounded-lg w-full"
          />
          <button
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
          >
            Subscribe
          </button>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <a href="#" class="text-gray-300 hover:text-[#fe572a]"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-gray-300 hover:text-[#fe572a]"><i class="fab fa-facebook"></i></a>
          <a href="#" class="text-gray-300 hover:text-[#fe572a]"><i class="fab fa-instagram"></i></a>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <router-link to="/about" class="text-gray-300 hover:text-[#fe572a]"
            >About</router-link
          >
          <router-link to="/blog" class="text-gray-300 hover:text-[#fe572a]"
            >Blog</router-link
          >
          <router-link to="/privacy" class="text-gray-300 hover:text-[#fe572a]"
            >Privacy</router-link
          >
          <router-link to="/terms" class="text-gray-300 hover:text-[#fe572a]"
            >Terms</router-link
          >
        </div>
        <p class="text-gray-400 font-lato text-sm">
          © 2025 Ascendia. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      isMenuOpen: false,
      showTooltip: false,
      billing: "monthly",
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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

/* Scroll Animation */
.section {
  opacity: 0;
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
</style>