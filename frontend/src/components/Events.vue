<!-- Events.vue -->
<template>
  <div class="min-h-screen font-lato">
    <!-- Header Section -->
    <header class="py-12 text-center">
      <h1 class="text-4xl md:text-5xl font-crimson text-gray-800">
        Grow your network & skills with these events.
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto px-4">
        Discover a variety of events to connect with professionals, learn new skills, and expand your horizons.
      </p>
    </header>

    <!-- Tags Section -->
    <div class="flex justify-center space-x-4 py-6">
      <button
        v-for="tag in tags"
        :key="tag"
        @click="selectTag(tag)"
        :class="[
          'px-4 py-2 rounded-full border-2 transition-all duration-300',
          selectedTag === tag
            ? 'border-orange-500 text-gray-800'
            : 'border-gray-800 text-gray-800'
        ]"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Events Section -->
    <div class="max-w-6xl mx-auto py-12 px-4">
      <div v-if="filteredEvents.length === 0" class="text-center text-gray-600">
        No events found for this category.
      </div>
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white rounded-lg shadow-md mb-8 flex flex-col md:flex-row flex-wrap"
      >
        <!-- Event Image -->
        <div class="md:w-1/3">
          <img
            :src="event.image"
            :alt="event.title"
            class="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>

        <!-- Event Information -->
        <div class="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span
              class="inline-block px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full mb-2"
            >
              {{ event.type }}
            </span>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              {{ event.title }}
            </h2>
            <p class="text-gray-600 mb-4">{{ event.description }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600">
                <span class="font-semibold">Location:</span> {{ event.location }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Host:</span> {{ event.host }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">
                <span class="font-semibold">Date & Time:</span>
                {{ event.dateTime }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Fee:</span> {{ event.fee }}
              </p>
            </div>
          </div>
        </div>

        <!-- See Details Button -->
        <div class="md:w-1/6 flex items-center justify-center p-6">
          <button
            @click="openModal(event)"
            class="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300"
          >
            See Details
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        v-if="isLoading"
        class="flex items-center justify-center"
      >
        <div
          class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <div
        v-else
        class="bg-white rounded-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          :src="selectedEvent.image"
          :alt="selectedEvent.title"
          class="w-full h-48 object-cover rounded-lg mb-4"
        />
        <span
          class="inline-block px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full mb-2"
        >
          {{ selectedEvent.type }}
        </span>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ selectedEvent.title }}
        </h2>
        <p class="text-gray-600 mb-4">{{ selectedEvent.description }}</p>
        <div class="grid grid-cols-1 gap-4">
          <p class="text-gray-600">
            <span class="font-semibold">Location:</span>
            {{ selectedEvent.location }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Host:</span> {{ selectedEvent.host }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Date & Time:</span>
            {{ selectedEvent.dateTime }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Fee:</span> {{ selectedEvent.fee }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Events',
  data() {
    return {
      tags: ['All Events', 'Online Events', 'Physical Events'],
      selectedTag: 'All Events',
      events: [
        {
          id: 1,
          type: 'Online',
          title: 'Web Development Masterclass',
          description:
            'Join our comprehensive online masterclass to learn the latest in web development.',
          location: 'Zoom Webinar',
          host: 'Tech Academy',
          dateTime: 'June 10, 2025, 10:00 AM',
          fee: '$49',
          image: 'https://via.placeholder.com/400x200?text=Web+Development',
        },
        {
          id: 2,
          type: 'Physical',
          title: 'Networking Mixer',
          description:
            'Connect with industry professionals at our exclusive networking event in downtown.',
          location: 'Downtown Conference Center',
          host: 'Business Connect',
          dateTime: 'June 15, 2025, 6:00 PM',
          fee: 'Free',
          image: 'https://via.placeholder.com/400x200?text=Networking+Mixer',
        },
        {
          id: 3,
          type: 'Online',
          title: 'AI & Machine Learning Workshop',
          description:
            'Dive into the world of AI with our hands-on workshop led by experts.',
          location: 'Google Meet',
          host: 'AI Innovators',
          dateTime: 'June 20, 2025, 2:00 PM',
          fee: '$99',
          image: 'https://via.placeholder.com/400x200?text=AI+Workshop',
        },
      ],
      isModalOpen: false,
      isLoading: false,
      selectedEvent: null,
    };
  },
  computed: {
    filteredEvents() {
      if (this.selectedTag === 'All Events') {
        return this.events;
      }
      return this.events.filter(
        (event) =>
          event.type.toLowerCase() ===
          this.selectedTag.split(' ')[0].toLowerCase()
      );
    },
  },
  methods: {
    selectTag(tag) {
      this.selectedTag = tag;
    },
    openModal(event) {
      this.isModalOpen = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.selectedEvent = event;
      }, 1000); // Simulate loading
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedEvent = null;
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700&family=Lato:wght@400;700&display=swap');

.font-crimson {
  font-family: 'Crimson Pro', serif;
}

.font-lato {
  font-family: 'Lato', sans-serif;
}

button {
  cursor: pointer;
}
</style>