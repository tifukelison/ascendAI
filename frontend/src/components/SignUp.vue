
<template>

<div v-if="isLoading" class="loader-overlay">
    <div class="loader"></div>
  </div>
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
        <h2>Create account</h2>
        <div class="input-wrapper">
          <input v-model="name" placeholder="Name" />
        </div>
        <div class="input-wrapper" >
          <input v-model="email" type="email" placeholder="Email"  @input="validateEmail"/>
          <span v-if="email && !isEmailValid" class="invalid-icon" >
            <i class="fas fa-times-circle"></i>
          </span>
          <span v-else-if="isEmailValid" class="valid-icon">
            <i class="fas fa-check-circle"></i>
          </span>
        </div>
        
        <p v-if="password && !isPasswordValid" class="validation-message">
          {{ passwordValidationMessage }}
        </p> <div class="input-wrapper" :class="{ 'password-valid': isPasswordValid }">
    <input 
      v-model="password" 
      :type="showPassword ? 'text' : 'password'" 
      placeholder="Password"
      @input="validatePassword"
    />
    <span class="password-toggle" @click="togglePasswordVisibility">
      <i :class="{ 'fa-eye': !showPassword, 'fa-eye-slash': showPassword }" class="fas"></i>
    </span>
  </div>
        <button @click="register" class="create-account-button">Create account</button>
        <p class="or-text">or sign up with</p>
        <button class="google-signin-button">
          <span class="google-icon">G</span></button>
        <p class="terms-text">By creating an account you agree to Ascendia's Terms of Services and Privacy Policy.</p>
        <p class="login-link">Have an account? <RouterLink to="/signin">Log In</RouterLink></p>
            
           
      </div>
      
    </div>
  </div>
</template>

<script>
import app from '../firebase';
import { ref } from "vue";
import { computed } from 'vue';
import { getAuth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "../firebase";
import { useRouter } from "vue-router";


export default {
  name: 'SignUp',
  setup() {
    const name = ref("");
    const auth = getAuth();
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const showPassword = ref(false);
    
    const passwordValidationMessage = ref('Password must be at least 6 characters with a capital letter and number');
    const isLoading = ref(false);

        const validateEmail = () => {
      // The isEmailValid computed property will handle the validation
      return isEmailValid.value;
    };

    const isEmailValid = computed(() => {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    });
    const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
    };
    const isPasswordValid = computed(() => {
        return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password.value);
    });

    const register = async () => {
      try {
        isLoading.value = true; // Show loader
        
        if (isPasswordValid.value) {
          
        }
        if (!isEmailValid.value) {
          throw new Error('auth/invalid-email');
        }

      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

      await updateProfile(userCredential.user, { displayName: name.value });
      router.push("/onboarding");
    } catch (error) {
      if (error.code === 'auth/weak-password') {
                passwordValidationMessage.value = 'Weak Password, should be at least 6 characters with a capital letter and number';
            } else {
                passwordValidationMessage.value = 'Password must be at least 6 characters with a capital letter and number';
            }
      console.error(error.message);
    } finally {
      isLoading.value = false;
    }
  };

    return { name, email, password, register, isEmailValid, isPasswordValid, showPassword, togglePasswordVisibility, validateEmail, isLoading, passwordValidationMessage };
  }, 
}
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
  .invalid-icon {    position: absolute;    right: 7px;    top: 50%;    transform: translateY(-50%);    color: #ef5350; /* Red color for the x icon */    font-size: 1.2em;    padding-right: 10px; /* Add 10px padding to the right of the icon */    opacity: 1;    animation: fadeIn 0.3s forwards;    pointer-events: none;  }



  .valid-icon {
    position: absolute;
    right: 7px;
    padding: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #66bb6a;
    font-size: 1.2em;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
    pointer-events: none; 
  }
  .password-toggle {
    position: absolute;
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

.create-account-button {
  width: 320px;
  background-color: #fe572a; /* Salmon/peach */
  border-radius: 30px;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 200ms, padding 100ms; 
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

  .loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #fe572a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.input-wrapper input {
  transition: border-color 0.3s ease;
}

.input-wrapper.password-valid input {
  border-color: #66bb6a !important;
}

/* Update existing password-valid class if needed */
.password-valid input {
  border: 2px solid #66bb6a;
}
</style>
