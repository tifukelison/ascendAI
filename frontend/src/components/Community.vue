<!-- /frontend/src/components/Community.vue -->
<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Community Leaderboard</h2>
    <p class="text-gray-600 mb-4">See the top learners in our community!</p>

    <div v-if="leaderboard.length" class="space-y-4">
      <div v-for="(user, index) in leaderboard" :key="user.id" class="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ index + 1 }}. {{ user.name }}</p>
          <p class="text-gray-600">XP: {{ user.xp }}</p>
        </div>
        <span v-if="index === 0" class="text-yellow-500">🏆</span>
      </div>
    </div>
    <p v-else class="text-gray-600">No users on the leaderboard yet.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  name: 'Community',
  setup() {
    const router = useRouter();
    const leaderboard = ref([]);

    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      // Fetch top 10 users by XP
      const leaderboardQuery = query(
        collection(db, 'users'),
        orderBy('xp', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(leaderboardQuery);
      leaderboard.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    return {
      leaderboard,
    };
  },
};
</script>