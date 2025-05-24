<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
</style>

<template>
  <router-view />
</template>

<script>
import { RouterView } from 'vue-router';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth } from "./firebase";

export default {
  components: {
    RouterView
  },
  setup() {
    const router = useRouter();

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
    });
  },
}
</script>
