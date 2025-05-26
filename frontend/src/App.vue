<template>
  <div v-if="isAuthChecked">
    <router-view />
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">
    <p class="text-gray-600 text-lg">Loading...</p>
  </div>
</template>

<script>
import { RouterView } from 'vue-router';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { auth } from "./firebase";

export default {
  components: {
    RouterView
  },
  setup() {
    const router = useRouter();
    const isAuthChecked = ref(false); // Track if authentication state has been checked

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        if (router.currentRoute.value.path === "/signin" || router.currentRoute.value.path === "/signup") {
          router.push("/dashboard"); // Redirect to dashboard if already signed in
        }
      } else {
        // User is signed out
        console.log("User is signed out");
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push("/signin"); // Redirect to sign-in if the route requires authentication
        }
      }
      isAuthChecked.value = true; // Mark authentication check as complete
    });

    return {
      isAuthChecked,
    };
  },
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
</style>