<!-- DashboardHome.vue -->
<template>
    <div class="dashboard-home">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h1>
      <p class="text-gray-600 mb-6">
        Here’s a quick overview of your progress and upcoming tasks.
      </p>
  
      <!-- Example Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Progress Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Your Progress</h2>
          <p class="text-gray-600">You’ve completed 5 out of 10 courses.</p>
          <div class="mt-4 h-2 bg-gray-200 rounded-full">
            <div class="h-full bg-blue-500 rounded-full" style="width: 50%"></div>
          </div>
        </div>
  
        <!-- Upcoming Tasks -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Upcoming Tasks</h2>
          <ul class="list-disc list-inside text-gray-600">
            <li>Complete "Vue Basics" by May 20, 2025</li>
            <li>Submit challenge project by May 22, 2025</li>
            <li>Join the "Tech Event" on May 25, 2025</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardHome',
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>