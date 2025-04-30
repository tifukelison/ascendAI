<template>
  <div class="container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <div class="left-column">
      <h1>Your career, sped up with AI</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <div class="placeholder-box"></div>
    </div>
    <div class="right-column">
      <div class="border">
        <img src="../assets/logo.png" alt="Ascendia Logo" class="logo">
        <h2>Welcome back</h2>
        <div class="input-wrapper">
          <input v-model="email" type="email" placeholder="Email" @input="validateEmail" />
          <span v-if="email && !isEmailValid" class="invalid-icon">
            <i class="fas fa-times-circle"></i>
          </span>
          <span v-else-if="isEmailValid" class="valid-icon">
            <i class="fas fa-check-circle"></i>
          </span>
        </div>
        <div class="input-wrapper">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" />
          <span
            class="password-toggle"
            @click="togglePasswordVisibility">
            <i :class="{ 'fa-eye': !showPassword, 'fa-eye-slash': showPassword }" class="fas"></i>
          </span>
        </div>
        <p v-if="!isPasswordValid" class="validation-message">{{ passwordErrorMessage }}</p>
        <button @click="signIn" class="create-account-button">Log In</button>
        <p class="or-text">or sign in with</p>
        <button class="google-signin-button" @click="signInWithGoogle">
          <span class="google-icon">G</span></button>
        <p class="terms-text">By logging in you agree to Ascendia's Terms of Services and Privacy Policy.</p>
        <p class="login-link">Don't have an account? <RouterLink to="/signup">Sign Up</RouterLink></p>
        </div>
      </div>
    </div>
</template>

<script>
import app from '../firebase';
import { ref, computed } from "vue";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "../firebase";
import { useRouter } from "vue-router";

export default {
  name: 'SignIn',
  setup() {
    const auth = getAuth();
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const passwordErrorMessage = ref("");
    const showPassword = ref(false);

    const validateEmail = () => {
      return isEmailValid.value;
    };

    const isEmailValid = computed(() => {
      // Corrected regex with escaped dot
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    });

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const isPasswordValid = computed(() => {       
      if (!password.value) return true;
      return password.value.length >= 6;
    });

    const signIn = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);        
        router.push("/dashboard");
        passwordErrorMessage.value = "";
      } catch (error) {
        console.error(error);
        if (error.code === "auth/wrong-password") {
          passwordErrorMessage.value = "Wrong password. Try again.";
        } else {
          // More appropriate error message for general cases
          passwordErrorMessage.value = "Error signing in. Please check your credentials.";
        }
      } // Added missing closing brace for catch
    };

    const signInWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push("/onboarding");
      } catch (error) {
        console.error("Error signing in with Google", error);
      }
    };

    return {
      email,
      password,
      signIn,
      isEmailValid,
      isPasswordValid,
      showPassword,
      togglePasswordVisibility,
      signInWithGoogle,
      validateEmail,
      passwordErrorMessage
    };
  } // Corrected setup closing
};
</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.logo {
  width: 100px;
}
.left-column {
  flex: 1;
  padding: 40px;
  margin: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.border {
  background-color: #faf9f5;
  border: 1px solid #dee2e6;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
}
.left-column h1 {
  font-size: 4em;
  color: #fe572a;
  line-height: 4rem;
  margin-bottom: 10px;
  font-family: 'CrimsonPro';
  font-weight: 100;
}

.left-column p {
  font-family: 'Lato';
  margin-bottom: 30px;
  font-size: 1.3em;
}

.right-column {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato';
}

.right-column h2 {
  font-size: 4em;
  color: #fe572a;
  line-height: 2.3rem;
  width: 238px;
  margin: 50px auto;
  font-family: 'CrimsonPro';
  font-weight: 100;
  text-align: center;
}

input {
  width: 300px;
  padding: 12px 10px;
  font-family: 'Lato';
  border: 2px solid #ccc9c9;
  border-radius: 7px;
  background: none;
  font-size: 0.85em;
  margin: 0px;
}
.input-wrapper {
  position: relative;
  width: 300px;
  margin: 5px;

  .valid-icon {
    position: absolute;
    padding: 10px;
    
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    color: #66bb6a;
    font-size: 1.2em;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
    pointer-events: none;
  }.password-valid{  border-radius: 7px;  overflow: hidden; /* Ensure the border-radius is applied correctly */}
    .invalid-icon {
    position: absolute;

    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    color: #ef5350; /* Red color for the x icon */
    font-size: 1.2em;    padding-right: 10px; /* Add 10px padding to the right of the icon */
    opacity: 0;
    animation: fadeIn 0.3s forwards;
    pointer-events: none;
  }
  .password-toggle {
    position: absolute;
    padding: 10px;
    

    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #777;
    pointer-events: auto;
  }
  .password-toggle:hover {
    color: #333;
  }
}.create-account-button {
  width: 320px;
  background-color: #fe572a; /* Salmon/peach */
  border-radius: 30px;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 200ms, padding 100ms;
}
input::placeholder {
font-family: 'Lato';
font-size: 0.85rem;
}

button {
  padding: 17px;
  border: none;
  color: white;
  font-family: 'LatoBold';
  cursor: pointer;
}

.create-account-button:hover {
  background-color: #ff3700;
  transition: 200ms;
}

.create-account-button:active {
padding: 15.5px; /* Reduce padding on tap */
}

.google-signin-button {
  background-color: #febeac;
  border-radius: 10px;
  font-size: 1em;
  color: #fe572a;
}

.or-text {
  text-align: center;
  /* padding: 10px; */
}

.terms-text {
  margin-top: 30px; text-align: center;
}

.login-link {
text-decoration: none;
}

.login-link a {
  text-decoration: none;
  color: #fe572a;
  font-weight: bold;
}

/* Mobile Responsiveness */
@media (max-width: 950px) {
  .container {
    flex-direction: column-reverse;
    height: auto;
  }

  .left-column, .right-column {
    padding: 20px;
  }

  .left-column {
    align-items: center;
    text-align: center;

  }
  .left-column h1, .left-column p {
    width: auto;
    padding: 15px;
  }
  
}

.validation-message {
  color: red;
  text-align: left;
  font-size: 0.8em;
  font-family: 'Lato';
  margin-bottom: 0px !important;
  margin: 0;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}




@keyframes borderFadeIn {
  from {  border-color: #ccc9c9; /* Initial border color */    box-shadow: none; /* No glow initially */  }
  to {  border-color: #4caf50; /* Green border */    box-shadow: 0 0 5px 2px rgba(76, 175, 80, 0.5); /* Subtle green glow */  }
}
.input-wrapper.password-valid input {
  border-color: #4caf50; /* Green color for the border */
  box-shadow: 0 0 5px 2px rgba(76, 175, 80, 0.5); /* Add a subtle green glow */
  animation: borderFadeIn 0.3s ease-in-out forwards; /* Apply animation */
}
</style>