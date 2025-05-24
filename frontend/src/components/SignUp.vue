<template>
  <div :class="['min-h-screen flex flex-col relative', isDarkMode ? 'bg-black text-white' : 'bg-white']">
    <!-- Background Grid -->
    <div :class="['absolute inset-0 pointer-events-none z-0 opacity-70', isDarkMode ? 'bg-grid-pattern-dark' : 'bg-grid-pattern']"></div>

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
          :class="['flex items-center font-lato font-bold hover:underline transition-colors duration-200', 'text-[#fe572a]']"
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
      <div class="flex flex-col items-center">
        <div :class="['p-8 rounded-xl shadow-sm border w-full max-w-md', isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
          <img :src="logos[isDarkMode ? 'dark' : 'light']" alt="Ascendia Logo" class="h-5 mx-auto mb-6" />
          <h2 :class="['font-crimson-pro text-3xl font-bold text-center mb-8', isDarkMode ? 'text-white' : 'text-gray-800']">
            Create Your Account
          </h2>

          <!-- Name Input -->
          <div class="relative mb-4">
            <input
              v-model="name"
              type="text"
              placeholder="Name"
              :class="[
                'font-lato w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-[#fe572a]' : 'border-gray-300 focus:border-[#fe572a]'
              ]"
            />
          </div>

          <!-- Email Input -->
          <div class="relative mb-4">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              :class="[
                'font-lato w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-[#fe572a]' : 'border-gray-300 focus:border-[#fe572a]'
              ]"
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
              :class="[
                'font-lato w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:border-[#fe572a]' : 'border-gray-300 focus:border-[#fe572a]',
                { 'border-green-500': isPasswordValid }
              ]"
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
            :class="['font-lato text-sm text-left mb-4 opacity-0 animate-fade-in', isDarkMode ? 'text-red-400' : 'text-red-500']"
          >
            {{ passwordValidationMessage }}
          </p>

          <!-- Create Account Button -->
          <button
            @click="register"
            :class="['font-lato font-bold w-full px-6 py-3 rounded-lg shadow transition-all duration-200 mb-6', isDarkMode ? 'bg-[#fe572a] text-white hover:bg-[#ff8c63] glow' : 'bg-[#fe572a] text-white hover:bg-[#ff8c63]']"
          >
            Create Account
          </button>

          <!-- Divider -->
          <p :class="['font-lato text-center mb-6', isDarkMode ? 'text-gray-400' : 'text-gray-600']">or sign up with</p>

          <!-- Google Sign-In Button -->
          <button
            @click="signInWithGoogle"
            :class="['font-lato font-bold w-full border-2 px-6 py-3 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2 mb-6', isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:border-[#fe572a]' : 'bg-white text-gray-800 border-gray-300 hover:border-[#fe572a]']"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google Logo"
              class="w-5 h-5"
            />
            Sign Up with Google
          </button>

          <!-- Terms and Login Links -->
          <p :class="['font-lato text-sm text-center mb-4', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            By creating an account, you agree to Ascendia’s
            <a href="#" :class="['hover:underline', isDarkMode ? 'text-white' : 'text-[#fe572a]']">Terms of Service</a>
            and
            <a href="#" :class="['hover:underline', isDarkMode ? 'text-white' : 'text-[#fe572a]']">Privacy Policy</a>.
          </p>
          <p :class="['font-lato text-sm text-center', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            Have an account?
            <RouterLink to="/signin" :class="['font-bold hover:underline', isDarkMode ? 'text-white' : 'text-[#fe572a]']">
              Log In
            </RouterLink>
          </p>
        </div>

        <!-- Dark Mode Toggle Button -->
        <div class="flex justify-center mt-5">
          <button @click="toggleDarkMode" class="font-lato font-bold px-4 py-2 rounded-lg shadow transition-all duration-200" :class="isDarkMode ? 'text-white' : 'text-gray-800'">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase"; // Import your Firestore instance
import logo from '../assets/logo.png';
import logo2 from '../assets/logo-2.png';

export default {
  name: "SignUp",
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);
    const isDarkMode = ref(true); // Add dark mode state
    const passwordValidationMessage = ref(
      "Password must be at least 6 characters with a capital letter and number"
    );
    const router = useRouter();
    const auth = getAuth();

    const logos = {
      light: logo,
      dark: logo2
    };

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

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
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
      isDarkMode, // Return dark mode state
      passwordValidationMessage,
      logos,
      isEmailValid,
      isPasswordValid,
      validateEmail,
      validatePassword,
      togglePasswordVisibility,
      toggleDarkMode,
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

.bg-grid-pattern-dark {
  background-image: radial-gradient(circle, #333333 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Animation for Validation Icons and Messages */
@keyframes fade-in {
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s forwards;
}

/* Glow Effect for Dark Mode */
.glow {
  box-shadow: 0 0 10px rgba(254, 87, 42, 0.5);
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