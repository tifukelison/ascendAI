<template>
  <div class="min-h-screen flex flex-col relative bg-[#f8fcf8]">
    <!-- Background Grid -->
    <div class="absolute inset-0 pointer-events-none z-0 opacity-70 bg-grid-pattern"></div>

    <!-- Floating Header Box -->
    <header class="mt-6 mx-auto w-full max-w-6xl rounded-xl shadow-md border bg-white/90 border-gray-200/80 py-3 px-3 sm:px-6 md:px-12 z-50">
      <nav class="flex items-center justify-between">
        <!-- Logo Left -->
        <div class="font-crimson-pro text-2xl font-bold tracking-tight">
          <img :src="logos.light" alt="Ascendia" class="h-5" />
        </div>
        <!-- Nav Right (Desktop) -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="font-lato font-bold transition-colors duration-200 text-gray-600 hover:text-gray-900"
            >Home</router-link
          >
          <router-link
            to="/about"
            class="font-lato font-bold transition-colors duration-200 text-gray-600 hover:text-gray-900"
            >About</router-link
          >
          <router-link
            to="/contact"
            class="font-lato font-bold transition-colors duration-200 text-gray-600 hover:text-gray-900"
            >Contact</router-link
          >
          <router-link
            to="/signup"
            class="font-lato font-bold bg-[#fe572a] text-white px-4 py-2 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
            >Get Started</router-link
          >
        </div>
        <!-- Nav Right (Mobile) -->
        <div class="flex items-center space-x-2 md:hidden">
          <span class="font-lato font-semibold text-gray-700">Menu</span>
          <button @click="toggleMenu" class="focus:outline-none">
            <svg
              width="28"
              height="28"
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
              <path
                d="M4 18H20"
                stroke="#1F2937"
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
            class="block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200 text-gray-600 hover:bg-gray-50"
            @click="isMenuOpen = false"
            >Home</router-link
          >
          <router-link
            to="/about"
            class="block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200 text-gray-600 hover:bg-gray-50"
            @click="isMenuOpen = false"
            >About</router-link
          >
          <router-link
            to="/contact"
            class="block font-lato font-bold px-2 py-1.5 rounded transition-colors duration-200 text-gray-600 hover:bg-gray-50"
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
    <section class="flex items-center justify-center px-6 md:px-12 py-10 md:py-20 relative z-10 section text-[#1b1b1b]">
      <div class="max-w-3xl text-center flex flex-col items-center">
        <h1
          class="font-crimson-pro text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          style="color: #1b1b1b;"
        >
          Finally, a tool to help you learn your skill on the job.
        </h1>
        <p class="font-lato text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-700">
          Tell us the skill you want to learn and your goal (wetin you wan use am do) — and we'll give you real-world challenges to complete. As you start completing challenges (you go dey build confidence), your portfolio, and experience.
        </p>
        <!-- Product Image -->
        <img
          src="../assets/showproduct.png"
          alt="Product Screenshot"
          class="w-full max-w-3xl mx-auto mb-8"
        />
        <p class="font-lato text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-gray-700">
          By the time you finish this sentence, 11+ people like will already be hired because they don't just learn — dem dey show working daily.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            to="/signup"
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
            >Get Started</router-link
          >
          <router-link
            to="/about"
            class="font-lato font-bold border-2 px-6 py-3 rounded-lg hover:-translate-y-1 transition-all duration-200 border-[#1a1a1a] text-[#1a1a1a] hover:bg-gray-100"
            >Learn More →</router-link
          >
        </div>
        <p class="text-sm mt-4 text-gray-500">Join 10+ achievers</p>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-10 px-6 md:px-12 relative z-10 section text-[#1b1b1b]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-5xl md:text-4xl font-crimson-pro font-bold text-center mb-7 text-gray-800">
          Benefits — Wetin You Go Gain
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="text-center p-6 rounded-xl shadow-sm bg-white">
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Learn by Doing</h3>
            <p class="font-lato text-base text-gray-600">
              No long stories, we give you real work. You'll learn the skill by actually doing it, like say you dey on the job already.
            </p>
          </div>
          <div class="text-center p-6 rounded-xl shadow-sm bg-white">
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Build a Job-Ready Portfolio</h3>
            <p class="font-lato text-base text-gray-600">
              As you complete challenges (you dey gather proof). Proof that you know what you're doing. Proof that you deliver. Na this kind thing dey open doors.
            </p>
          </div>
          <div class="text-center p-6 rounded-xl shadow-sm bg-white">
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Stay Accountable Without Pressure</h3>
            <p class="font-lato text-base text-gray-600">
              Go at your own pace — nobody will stress you. But the leaderboard will show you who's at the top of their game, so you fit ginger yourself and stay on track.
            </p>
          </div>
          <div class="text-center p-6 rounded-xl shadow-sm bg-white">
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Get Noticed, Get Hired</h3>
            <p class="font-lato text-base text-gray-600">
              People who use Ascendia land roles because they  show working (not just talk), na action we dey push. Do the work, and the work will find you.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-6 md:px-12 relative z-10 section text-[#1b1b1b]">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 relative before:absolute before:inset-0 before:h-0.5 before:bg-gray-200 before:top-1/2 before:-translate-y-1/2 before:md:block before:hidden"
        >
          <div class="p-6 rounded-xl shadow-sm text-center relative z-10 bg-white">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-2xl">
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Tell Us What You Want to Learn / Upskill</h3>
            <p class="font-lato text-base text-gray-600">
              For onboarding, just tell us the skill you want to learn and your goal (na from there we go customize everything for you.)
            </p>
          </div>
          <div class="p-6 rounded-xl shadow-sm text-center relative z-10 bg-white">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-2xl">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Enter Your Dashboard</h3>
            <p class="font-lato text-base text-gray-600">
              From here, you'll navigate everything — challenges, courses, jobs, and events. Na your control center be this.
            </p>
          </div>
          <div class="p-6 rounded-xl shadow-sm text-center relative z-10 bg-white">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fe572a] text-white flex items-center justify-center text-2xl">
              <i class="fas fa-tasks"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 font-crimson-pro">Start Real Challenges</h3>
            <p class="font-lato text-base text-gray-600">
              We will generate challenges based on your skill and goal (no theory, na practical work). You'll land a job in no time if you practice well.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What We're Actually Doing Section -->
    <section class="py-16 px-4 sm:px-8 md:px-24 bg-white relative z-10 section">
      <div class="max-w-4xl mx-auto flex flex-col items-center">
        <h2 class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-8 text-[#1b1b1b]">
          What we're actually doing.
        </h2>
        <p class="font-lato text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10 leading-snug">
          Okay, listen up. We know you are dedicated to being good at what you do — heck everyone is — but sometimes people fall off track. They lack the motivation to continue, they don't know what to do. Everything just seems so complex and unattainable. We're here to fix that. By telling us the skill you want to learn, your goal for that skill — whether it be lead generation, getting clients, or increasing your expertise — we give you challenges to accomplish that specific goal.
        </p>
        <h3 class="text-2xl md:text-3xl font-crimson-pro font-bold text-center mb-8 text-[#1b1b1b]">
          Does that sound like something you want?
        </h3>
        <router-link
          to="/signup"
          class="font-lato font-bold bg-[#fe572a] text-white px-8 py-4 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 text-xl"
        >
          Get Started
        </router-link>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 px-6 md:px-12 bg-gray-50 relative z-10 section">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-crimson-pro font-bold text-center mb-12 text-gray-800">
          Got Questions? We've Got Answers.
        </h2>
        <div class="space-y-4">
          <details class="p-4 rounded-lg shadow-sm bg-white">
            <summary class="font-lato font-bold text-lg cursor-pointer text-black">
              How often can I get a new challenge?
            </summary>
            <p class="font-lato text-base mt-2 text-gray-600">
              Daily, weekly, or whenever you’re ready to tackle something new. Your call, hero.
            </p>
          </details>
          <details class="p-4 rounded-lg shadow-sm bg-white">
            <summary class="font-lato font-bold text-lg cursor-pointer text-black">
              Is there a free option?
            </summary>
            <p class="font-lato text-base mt-2 text-gray-600">
              Yep, start with basic challenges and community access, no cost. No cap, this is the best thing since sliced bread (and we’re not even bread)!
            </p>
          </details>
          <details class="p-4 rounded-lg shadow-sm bg-white">
            <summary class="font-lato font-bold text-lg cursor-pointer text-black">
              Can I connect with mentors?
            </summary>
            <p class="font-lato text-base mt-2 text-gray-600">
              Absolutely, our community hooks you up with mentors to guide you. Like a wise sage, but cooler.
            </p>
          </details>
          <details class="p-4 rounded-lg shadow-sm bg-white">
            <summary class="font-lato font-bold text-lg cursor-pointer text-black">
              What’s the deal with live battles?
            </summary>
            <p class="font-lato text-base mt-2 text-gray-600">
              Compete live against others to earn XP and climb the leaderboard. If you’re waiting for a sign, this is it. Literally.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- Footer / Final CTA -->
    <footer class="py-10 px-6 md:px-12 relative z-10 bg-[#1b1b1b] text-white">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl font-crimson-pro font-bold mb-6">
          Ready to Level Up?
        </h2>
        <p class="font-lato text-base mb-6 text-gray-300">
          Drop your email to join the crew crushing it. Your adventure awaits. 🌟
        </p>
        <div class="flex justify-center gap-4 mb-8 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            class="font-lato px-4 py-3 rounded-lg w-full text-gray-600"
          />
          <button
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200"
          >
            Subscribe
          </button>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-facebook"></i></a>
          <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-instagram"></i></a>
        </div>
        <div class="flex justify-center gap-6 mb-6">
          <router-link to="/about" class="hover:text-[#fe572a] text-gray-300"
            >About</router-link
          >
          <router-link to="/blog" class="hover:text-[#fe572a] text-gray-300"
            >Blog</router-link
          >
          <router-link to="/privacy" class="hover:text-[#fe572a] text-gray-300"
            >Privacy</router-link
          >
          <router-link to="/terms" class="hover:text-[#fe572a] text-gray-300"
            >Terms</router-link
          >
        </div>
        <p class="font-lato text-sm text-gray-400">
          © 2025 Ascendia. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import logo from '../assets/logo.png';
import Contact from './Contact.vue';

export default {
  name: "LandingPage",
  components: {
    Contact,
  },
  data() {
    return {
      isMenuOpen: false,
      logos: {
        light: logo,
      }
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
  .text-2xl {
    font-size: 1.25rem;
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