<template>
  <div class="min-h-screen flex flex-col relative bg-[#f8fcf8]">
    <!-- Background Grid -->
    <div class="absolute inset-0 pointer-events-none z-0 opacity-70 bg-grid-pattern"></div>

    <!-- Floating Header Box -->
    <header class="mt-6 mx-auto  w-full max-w-6xl rounded-xl shadow-md border bg-white/90 border-gray-200/80 py-3 px-3 sm:px-6 md:px-12 z-50">
      <nav class="flex items-center justify-between">
        <!-- Back to Home -->
        <router-link
          to="/"
          class="font-lato font-bold transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <i class="fas fa-chevron-left"></i>
          Back to Home
        </router-link>
      </nav>
    </header>

    <!-- Creed Section -->
    <section class="flex-grow flex items-center justify-center px-6 md:px-12 py-10 md:py-20 relative z-10 section text-[#1b1b1b]">
      <div class="max-w-4xl text-center flex flex-col items-center">
        <h1 class="font-crimson-pro text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          We’re in the business of breakthroughs.
        </h1>
        <ul class="font-lato text-xl md:text-2xl mb-8 text-gray-600 text-center mx-auto max-w-2xl space-y-2">
          <li>We dey build change, no just follow am.</li>
          <li>We no dey wait. We dey move—every damn day.</li>
          <li>Results dey talk. Process fit bend.</li>
          <li>This na war, no be weekend workshop.</li>
          <li>Assume nothing. Deliver sharp. Stretch wetin dem call impossible.</li>
          <li>Use wetin you get. No excuses.</li>
          <li>You never finish until e really done.</li>
          <li>E go rough sometimes. Na part of the journey.</li>
          <li>If we move right, the win go follow—automatic.</li>
        </ul>
        <button @click="toggleContent" class="font-lato font-bold text-lg transition-colors duration-200 bg-[#fe572a] text-white px-6 py-2 rounded-lg shadow hover:bg-[#ff8c63]">
          {{ showContent ? 'See Less' : 'See More' }}
        </button>
      </div>
    </section>

    <!-- About Us Section -->
    <transition name="fade">
      <section v-if="showContent" class="flex-grow flex items-center justify-center px-6 md:px-12 py-10 md:py-20 relative z-10 section text-[#1b1b1b]">
        <div class="max-w-4xl text-center flex flex-col items-center">
          <!-- Brand Essence -->
          <h1 class="font-crimson-pro text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            About Ascendia
          </h1>
          <p class="font-lato text-lg md:text-xl mb-8 text-gray-600">
            Transforming ambition into adventure. At Ascendia, we make every goal feel like a victory parade, turning the mundane into moments worth celebrating.
          </p>

          <!-- Mission -->
          <div class="mb-12">
            <h2 class="font-crimson-pro text-3xl font-bold mb-4">
              Our Mission
            </h2>
            <p class="font-lato text-base text-gray-600">
              To fuel daily progress with fun. Through gamified challenges, we make self-improvement exciting, rewarding, and achievable.
            </p>
          </div>

          <!-- Vision -->
          <div class="mb-12">
            <h2 class="font-crimson-pro text-3xl font-bold mb-4">
              Our Vision
            </h2>
            <p class="font-lato text-base text-gray-600">
              A united tribe of confident young heroes, rising together. Rooted in Cameroonian pride, we’re building a global community where every challenge uplifts and every triumph inspires.
            </p>
          </div>

          <!-- Core Values -->
          <div>
            <h2 class="font-crimson-pro text-3xl font-bold mb-4">
              Our Values
            </h2>
            <ul class="font-lato text-base list-disc list-inside text-gray-600 text-left mx-auto max-w-2xl space-y-2">
              <li><strong>Ambition & Adventure:</strong> Every young person can be the hero of their own story.</li>
              <li><strong>Accountability & Achievement:</strong> We celebrate wins together – no one does it alone.</li>
              <li><strong>Creativity & Humor:</strong> We solve problems with wit and memes, making growth fun.</li>
              <li><strong>Community & Kindness:</strong> We lift each other up, turning private victories into shared pride.</li>
            </ul>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {
      showContent: false,
    };
  },
  methods: {
    toggleContent() {
      this.showContent = !this.showContent;
    },
  },
};
</script>

<style scoped>
/* Background Grid Pattern */
.bg-grid-pattern {
  background-image: radial-gradient(circle, #f0b5a4 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Font Awesome for Icons */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

/* Custom Fonts */
.font-lato {
  font-family: "Lato", sans-serif;
}

.font-crimson-pro {
  font-family: "Crimson Pro", serif;
}

/* Transition for content */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Responsive Typography */
@media (max-width: 640px) {
  .text-7xl {
    font-size: 2.5rem;
  }
  .text-6xl {
    font-size: 2.25rem;
  }
  .text-5xl {
    font-size: 1.75rem;
  }
  .text-4xl {
    font-size: 1.5rem;
  }
}
</style>