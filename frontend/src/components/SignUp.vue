<template>
  <div class="min-h-screen flex flex-col bg-white relative">
    <!-- Background Grid -->
    <div class="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70"></div>

    

    <!-- Loader Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-[#fe572a] rounded-full animate-spin"></div>
    </div>

    <!-- Sign-Up Form (Centered) -->
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
          Create Your Account
        </h2>

        <!-- Name Input -->
        <div class="relative mb-4">
          <input
            v-model="name"
            type="text"
            placeholder="Name"
            class="font-lato w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#fe572a] transition-all duration-200"
          />
        </div>

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
            :class="{ 'border-green-500': isPasswordValid }"
            @input="validatePassword"
          />
          <span
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors duration-200"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <p
          v-if="password && !isPasswordValid"
          class="font-lato text-sm text-red-500 text-left mb-4 opacity-0 animate-fade-in"
        >
          {{ passwordValidationMessage }}
        </p>

        <!-- Create Account Button -->
        <button
          @click="register"
          class="font-lato font-bold w-full bg-[#fe572a] text-white px-6 py-3 rounded-lg shadow hover:bg-[#ff8c63] hover:-translate-y-1 transition-all duration-200 mb-6"
        >
          Create Account
        </button>

        <!-- Divider -->
        <p class="font-lato text-gray-600 text-center mb-6">or sign up with</p>

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
          Sign Up with Google
        </button>

        <!-- Terms and Login Links -->
        <p class="font-lato text-sm text-gray-600 text-center mb-4">
          By creating an account, you agree to Ascendia’s
          <a href="#" class="text-[#fe572a] hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-[#fe572a] hover:underline">Privacy Policy</a>.
        </p>
        <p class="font-lato text-sm text-gray-600 text-center">
          Have an account?
          <RouterLink to="/signin" class="text-[#fe572a] font-bold hover:underline">
            Log In
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  name: "SignUp",
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);
    const passwordValidationMessage = ref(
      "Password must be at least 6 characters with a capital letter and number"
    );
    const router = useRouter();
    const auth = getAuth();

    const isEmailValid = computed(() => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    });

    const isPasswordValid = computed(() => {
      return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password.value);
    });

    const validateEmail = () => {
      return isEmailValid.value;
    };

    const validatePassword = () => {
      // Validation handled by isPasswordValid computed property
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const register = async () => {
      try {
        isLoading.value = true;
        if (!isEmailValid.value) {
          throw new Error("auth/invalid-email");
        }
        if (!isPasswordValid.value) {
          throw new Error("auth/weak-password");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        await updateProfile(userCredential.user, { displayName: name.value });
        router.push("/onboarding");
      } catch (error) {
        if (error.code === "auth/weak-password") {
          passwordValidationMessage.value =
            "Weak Password, should be at least 6 characters with a capital letter and number";
        } else {
          passwordValidationMessage.value =
            "Password must be at least 6 characters with a capital letter and number";
        }
        console.error(error.message);
      } finally {
        isLoading.value = false;
      }
    };

    const signInWithGoogle = async () => {
      try {
        isLoading.value = true;
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        await updateProfile(userCredential.user, { displayName: userCredential.user.displayName });
        router.push("/onboarding");
      } catch (error) {
        console.error("Google Sign-In Error:", error.message);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      showPassword,
      isLoading,
      passwordValidationMessage,
      isEmailValid,
      isPasswordValid,
      validateEmail,
      validatePassword,
      togglePasswordVisibility,
      register,
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

/* Animation for Validation Icons and Messages */
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