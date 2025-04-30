<!-- /frontend/src/components/Challenges.vue -->
<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Configure Your Challenges</h2>
    <p class="text-gray-600 mb-4">Set up your challenge plan for <strong>{{ focusSkill }}</strong> to achieve your goal: <strong>{{ goal }}</strong>.</p>
    
    <form @submit.prevent="submitForm">
      <!-- Frequency -->
      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2">Challenge Frequency</label>
        <div class="space-y-2">
          <div>
            <input type="radio" id="daily" value="daily" v-model="form.frequency" class="mr-2">
            <label for="daily" class="text-gray-700">Daily (30 challenges/month)</label>
          </div>
          <div>
            <input type="radio" id="3x-week" value="3x/week" v-model="form.frequency" class="mr-2">
            <label for="3x-week" class="text-gray-700">3x/Week (12 challenges/month)</label>
          </div>
          <div>
            <input type="radio" id="weekly" value="weekly" v-model="form.frequency" class="mr-2">
            <label for="weekly" class="text-gray-700">Weekly (4 challenges/month)</label>
          </div>
        </div>
      </div>

      <!-- Number of Challenges -->
      <div class="mb-6">
        <label for="challenge-count" class="block text-gray-700 font-medium mb-2">Number of Challenges (1–30)</label>
        <input type="range" id="challenge-count" v-model.number="form.challengeCount" min="1" max="30" class="w-full">
        <p class="text-gray-600 mt-1">Selected: {{ form.challengeCount }}</p>
      </div>

      <!-- Skip Allowance -->
      <div class="mb-6">
        <label class="flex items-center">
          <input type="checkbox" v-model="form.skipAllowanceEnabled" class="mr-2">
          <span class="text-gray-700">Allow up to 3 skips per month (preserves streak)</span>
        </label>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Save Preferences
      </button>
    </form>

    <!-- Confirmation Message -->
    <div v-if="confirmationMessage" class="mt-4 p-4 bg-green-100 text-green-800 rounded">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from '../firebase';
import { auth, db } from '../firebase';

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      frequency: 'daily',
      challengeCount: 1,
      skipAllowanceEnabled: true,
    });
    const focusSkill = ref('');
    const goal = ref('');
    const confirmationMessage = ref('');

    // Fetch user data on mount
    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin'); // Redirect if not authenticated
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        focusSkill.value = data.focusSkill || 'Unknown Skill';
        goal.value = data.goal || 'No goal set';
        // Load existing preferences if any
        if (data.challenge_frequency) form.value.frequency = data.challenge_frequency;
        if (data.challenge_count) form.value.challengeCount = data.challenge_count;
        if (data.skip_allowance !== undefined) form.value.skipAllowanceEnabled = data.skip_allowance > 0;
      }
    });

    // Submit form to Firestore
    const submitForm = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          challenge_frequency: form.value.frequency,
          challenge_count: form.value.challengeCount,
          skip_allowance: form.value.skipAllowanceEnabled ? 3 : 0,
          skip_count: 0, // Reset skip count on new configuration
        });
        confirmationMessage.value = `Preferences saved! You'll receive ${form.value.challengeCount} ${form.value.frequency} challenges to achieve your goal.`;
      } catch (error) {
        console.error('Error saving preferences:', error);
        confirmationMessage.value = 'Error saving preferences. Please try again.';
      }
    };

    return {
      form,
      focusSkill,
      goal,
      confirmationMessage,
      submitForm,
    };
  },
};
</script>