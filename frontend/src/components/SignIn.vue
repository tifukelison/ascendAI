<template>
  <div class="min-h-screen flex flex-col bg-white relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70"></div>

    <!-- Loader Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#fe572a] rounded-full animate-spin"></div>
    </div>

    <!-- Sign-In Form (Centered) -->
    <div class="flex items-center justify-center min-h-screen px-6 py-20 relative z-10">
      <!-- Back to Homepage -->
    <div class="absolute top-6 w-full flex justify-center z-10">
      <router-link
      to="/"
      class="flex items-center text-[#fe572a] font-lato font-bold hover:underline transition-colors duration-200"
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5 mr-2"
      >
        <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Homepage
      </router-link>
    </div>
      <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <img src="../assets/logo.png" alt="Ascendia Logo" class="h-7 mx-auto mb-6" />
        <h2 class="font-crimson-pro text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome Back
        </h2>

        <!-- Email Input -->
        <div class="relative mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="font-lato w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#fe572a] transition-all duration-200"
            @input="validateEmail"
          />
          <span
            v-if="email && !isEmailValid"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg opacity-0 animate-fade-in"
          >
            <i class="fas fa-times-circle"></i>
          </span>
          <span
            v-else-if="email && isEmailValid"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg opacity-0 animate-fade-in"
          >
            <i class="fas fa-check-circle"></i>
          </span>
        </div>

        <!-- Password Input -->
        <div class="relative mb-4">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="font-lato w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#fe572a] transition-all duration-200"
            :class="{ 'border-green-500': isPasswordValid && password }"
            @input="validatePassword"
          />
          <span
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors duration-200"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <!-- Error Message -->
        <p
          v-if="errorMessage"
          class="font-lato text-sm text-red-500 text-center mb-4 opacity-0 animate-fade-in"
        >
          {{ errorMessage }}
        </p>

        <!-- Log In Button -->
        <button
          @click="signIn"
          class="font-lato font-bold w-full bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 mb-6"
        >
          Log In
        </button>

        <!-- Divider -->
        <p class="font-lato text-gray-600 text-center mb-6">or sign in with</p>

        <!-- Google Sign-In Button -->
        <button
          @click="signInWithGoogle"
          class="font-lato font-bold w-full bg-white border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow hover:border-[#fe572a] hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 mb-6"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Logo"
            class="w-5 h-5"
          />
          Sign In with Google
        </button>

        <!-- Terms and Sign-Up Link -->
        <p class="font-lato text-sm text-gray-600 text-center mb-4">
          By logging in, you agree to Ascendia’s
          <a href="#" class="text-[#fe572a] hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-[#fe572a] hover:underline">Privacy Policy</a>.
        </p>
        <p class="font-lato text-sm text-gray-600 text-center">
          Don’t have an account?
          <RouterLink to="/signup" class="text-[#fe572a] font-bold hover:underline">
            Sign Up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default {
  name: "SignIn",
  setup() {
    const auth = getAuth();
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const router = useRouter();

    const isEmailValid = computed(() => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    });

    const isPasswordValid = computed(() => {
      if (!password.value) return true;
      return password.value.length >= 6;
    });

    const validateEmail = () => {
      errorMessage.value = "";
      return isEmailValid.value;
    };

    const validatePassword = () => {
      errorMessage.value = "";
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const signIn = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // Set session persistence
    await setPersistence(auth, browserLocalPersistence);

    if (!email.value) {
      errorMessage.value = "Please enter your email.";
      return;
    }
    if (!isEmailValid.value) {
      errorMessage.value = "Invalid email format.";
      return;
    }
    if (!password.value) {
      errorMessage.value = "Please enter your password.";
      return;
    }
    if (!isPasswordValid.value) {
      errorMessage.value = "Password must be at least 6 characters.";
      return;
    }
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email format.";
        break;
      case "auth/user-not-found":
        errorMessage.value = "No account found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Incorrect password. Try again.";
        break;
      case "auth/too-many-requests":
        errorMessage.value = "Too many attempts. Try again later.";
        break;
      default:
        errorMessage.value = "Error signing in. Please check your credentials.";
    }
    console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

        const signInWithGoogle = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = "";
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
    
        // Check if the user has completed onboarding
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists() && userDoc.data().onboardingComplete) {
          // Redirect to dashboard if onboarding is complete
          router.push("/dashboard");
        } else {
          // Redirect to onboarding if not complete
          router.push("/onboarding");
        }
      } catch (error) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            errorMessage.value = "Google Sign-In was cancelled.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage.value = "Account exists with a different sign-in method.";
            break;
          default:
            errorMessage.value = "Error signing in with Google.";
        }
        console.error("Google Sign-In Error:", error.message);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      showPassword,
      isLoading,
      errorMessage,
      isEmailValid,
      isPasswordValid,
      validateEmail,
      validatePassword,
      togglePasswordVisibility,
      signIn,
      signInWithGoogle,
    };
  },
};
</script>

<style scoped>
/* Background Grid Pattern */
.bg-grid-pattern {
  background-image: radial-gradient(circle, #f0b5a4 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Animation for Validation Icons and Error Messages */
@keyframes fade-in {
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s forwards;
}

/* Responsive Typography */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.5rem;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .max-w-md {
    width: 100%;
    padding: 1rem;
  }
  input {
    font-size: 0.9rem;
  }
}
</style>