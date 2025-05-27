<template>
  <div class="min-h-screen flex flex-col relative bg-[#f8fcf8]">
    <!-- Background Grid -->
    <div class="absolute inset-0 pointer-events-none z-0 opacity-70 bg-grid-pattern"></div>

    <!-- Floating Header Box -->
    <header class="mt-6 mx-auto w-full max-w-6xl rounded-xl shadow-md border bg-white/90 border-gray-200/80 py-3 px-3 sm:px-6 md:px-12 z-50">
      <nav class="flex items-center justify-between">
        <!-- Home Link -->
        <router-link
          to="/"
          class="font-lato font-bold transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <i class="fas fa-chevron-left"></i>
          Back to Home
        </router-link>
      </nav>
    </header>

    <!-- Contact Section -->
    <section class="flex-grow flex items-center justify-center px-6 md:px-12 py-10 md:py-20 relative z-10 section text-[#1b1b1b]">
      <div class="max-w-3xl w-full text-center flex flex-col items-center">
        <h1 class="font-crimson-pro text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Got Questions? Let's Chat! 📞
        </h1>
        <p class="font-lato text-lg md:text-xl mb-8 text-gray-700">
          Yeah, you. The one with the burning questions. We're all ears and ready to help. Drop us a line, and let's make magic happen.
        </p>

        <!-- Contact Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 w-full">
          <input
            type="text"
            placeholder="Your Name"
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            required
            class="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700"
          ></textarea>
          <button
            type="submit"
            class="font-lato font-bold bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] transition-all duration-200"
          >
            Send Message
          </button>
        </form>

        <!-- Address and Social Media -->
        <div class="mt-12">
          <p class="font-lato text-base text-gray-500">
            Visit us at our lair: Bamenda
          </p>
          <div class="flex justify-center gap-6 mt-6">
            <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-facebook"></i></a>
            <a href="#" class="hover:text-[#fe572a] text-gray-300"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Contact",
  methods: {
    handleSubmit() {
      alert("Message sent! We'll get back to you faster than a ninja on a sugar rush. 🥷");
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
</style>