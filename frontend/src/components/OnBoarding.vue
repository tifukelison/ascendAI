<template>
  <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div class="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
  </div>
  <div class="flex flex-col md:flex-row p-6 md:p-10 min-h-screen">
    <!-- Left Column -->
    <div class="md:sticky md:top-10 flex-1 p-5 md:mr-10 mb-6 md:mb-0">
      <h1 class="font-crimson text-3xl md:text-4xl text-dark mb-4">Your career, sped up with AI</h1>
      <p class="font-lato text-dark text-base md:text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div class="h-48 bg-gray-200 rounded-lg mt-6"></div>
    </div>

    <!-- Right Column -->
    <div class="flex-1 p-5">
      <div class="max-w-xl mx-auto">
        <!-- Progress Line -->
        <div class="flex items-center mb-8">
          <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-500 ease-in-out"
              :style="{ width: `${Math.round(((currentStep + 1) / steps.length) * 100)}%` }"
            ></div>
          </div>
          <span class="ml-4 font-lato font-bold text-primary">
            {{ Math.round(((currentStep + 1) / steps.length) * 100) }}%
          </span>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 text-red-700 font-lato p-4 rounded-lg mb-4">
          {{ error }}
        </div>

        <!-- Form Steps -->
        <transition name="fade" mode="out-in">
          <div :key="currentStep" class="mb-6">
            <!-- Step 1: Name, Skills, Focus Skill, Level -->
            <div v-if="currentStep === 0">
              <!-- Name -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">What’s your name?</h4>
                <input
                  type="text"
                  v-model="formData.name"
                  placeholder="Your name..."
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <!-- Skills -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">What are your top skills? (Max 10)</h4>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="(skill, index) in formData.skills"
                    :key="index"
                    class="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-full font-lato text-sm text-dark cursor-pointer hover:bg-gray-200 transition-all"
                    @click="removeSkill(skill)"
                  >
                    {{ formatSkillName(skill) }}
                  </span>
                  <p v-if="formData.skills.length >= 10" class="text-primary font-lato text-sm mt-2">
                    You've reached the max of 10 skills.
                  </p>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    v-model="skillSearch"
                    placeholder="Type a skill..."
                    @input="searchSkills"
                    @keydown.enter.prevent="handleAddSkill"
                    class="w-full p-3 border-2 border-primary rounded-full font-lato text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-all"
                    @click="handleAddSkill"
                    :disabled="!canAddSkill || !skillSearch.trim()"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <transition name="fade">
                  <ul v-if="filteredSkills.length && skillSearch" class="absolute w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 p-0 list-none">
                    <li
                      v-for="(skill, index) in filteredSkills"
                      :key="index"
                      @click="selectSkill(skill)"
                      class="p-3 cursor-pointer hover:bg-gray-100 font-lato text-dark transition-all"
                    >
                      {{ formatSkillName(skill) }}
                    </li>
                  </ul>
                </transition>
              </div>

              <!-- Focus Skill -->
              <div class="mb-6" v-if="formData.skills.length > 0">
                <h4 class="font-crimson text-xl text-dark mb-2">Which skill do you want to focus on most?</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(skill, index) in formData.skills"
                    :key="index"
                    @click="formData.focusSkill = skill"
                    class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all"
                    :class="{
                      'bg-[#fe572a] text-white border-primary': formData.focusSkill === skill,
                      'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200': formData.focusSkill !== skill
                    }"
                  >
                    {{ formatSkillName(skill) }}
                  </span>
                </div>
              </div>

              <!-- Level -->
              <div class="mb-6" v-if="formData.focusSkill">
                <h4 class="font-crimson text-xl text-dark mb-2">What’s your current experience level?</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="level in levels"
                    :key="level"
                    @click="formData.level = level"
                    class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all"
                    :class="{
                      'bg-[#fe572a] text-white border-primary': formData.level === level,
                      'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200': formData.level !== level
                    }"
                  >
                    {{ level }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Step 2: Interests, Goal -->
            <div v-else-if="currentStep === 1">
              <!-- Interests -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">What are your interests?</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="interest in allInterests"
                    :key="interest"
                    @click="toggleInterest(interest)"
                    class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all"
                    :class="{
                      'bg-[#fe572a] text-white border-primary': formData.interests?.includes(interest),
                      'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200': !formData.interests?.includes(interest)
                    }"
                  >
                    {{ formatInterestName(interest) }}
                  </span>
                </div>
              </div>

              <!-- Goal -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">What’s your main goal right now for your skill {{ formData.focusSkill ? formatSkillName(formData.focusSkill) : '' }}?</h4>
                <input
                  type="text"
                  v-model="formData.goal"
                  placeholder="Your goal..."
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            <!-- Step 3: Location, Phone Number, About, Profile Picture -->
            <div v-else-if="currentStep === 2">
              <!-- Location -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">Where are you based?</h4>
                <input
                  type="text"
                  v-model="formData.location"
                  placeholder="Your city or region"
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <!-- Phone Number -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">What’s your phone number? (optional)</h4>
                <input
                  type="tel"
                  v-model="formData.phone"
                  placeholder="Enter phone number"
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <small class="font-lato text-dark text-sm mt-2 block">Include country code (e.g., +1 for USA)</small>
              </div>

              <!-- About -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">Tell us something about you (optional)</h4>
                <textarea
                  v-model="formData.about"
                  placeholder="Say something cool..."
                  rows="4"
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
                ></textarea>
              </div>

              <!-- Profile Picture -->
              <div class="mb-6">
                <h4 class="font-crimson text-xl text-dark mb-2">Upload a profile picture (optional)</h4>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleProfilePictureUpload"
                  class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <div class="mt-4">
                  <img :src="profilePicturePreview" alt="Profile Picture Preview" class="w-32 h-32 rounded-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-10">
          <button
            class="px-6 py-3 bg-gray-100 border border-gray-300 rounded-full font-lato text-dark hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="prevStep"
            :disabled="currentStep === 0"
          >
            Back
          </button>
          <button
            class="px-6 py-3 bg-[#fe572a] text-white rounded-full font-lato hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="nextStep"
            :disabled="!isCurrentStepValid"
          >
            {{ currentStep === steps.length - 1 ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Compressor from 'compressorjs';
import Papa from 'papaparse';
import { auth, db } from '../firebase';

const router = useRouter();

// Default profile picture as Base64 string (1x1 pixel gray placeholder for demo)
const defaultProfilePictureBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

// State
const isLoading = ref(false);
const error = ref(null);
const currentStep = ref(0);
const steps = ref(['personalSkills', 'interestsGoal', 'additionalInfo']);
const formData = ref({
  name: auth.currentUser?.displayName || '',
  email: auth.currentUser?.email || '',
  skills: [],
  focusSkill: null,
  level: null,
  interests: [],
  goal: '',
  location: '',
  phone: '', // Make phone optional
  about: '',
  profilePictureBase64: defaultProfilePictureBase64, // Initialize with default
  xp: 0,
  watchedVideos: [],
  lessonsCompleted: [],
  courseProgress: {},
});
const profilePictureFile = ref(null);
const profilePicturePreview = ref(defaultProfilePictureBase64); // Initialize preview with default
const skillSearch = ref('');
const filteredSkills = ref([]);
const allSkills = ref([]);
const allInterests = ref([
  'Content Marketing', 'Digital Marketing', 'Facebook', 'Instagram', 'Marketing', 'Politics',
  'Social Media', 'Social Media Marketing', 'Tech', 'Technology', 'Twitter', 'Business',
  'Entrepreneurship', 'Leadership', 'Life', 'Life Lessons', 'Marketing', 'Productivity',
  'Self Improvement', 'Startup', 'Venture Capital', 'Atheism', 'Christianity', 'Faith',
  'God', 'Islam', 'Philosophy', 'Politics', 'Religion', 'Spirituality'
]);
const levels = ref(['Beginner', 'Intermediate', 'Advanced']);

// Load form data from localStorage if available
onMounted(() => {
  const savedFormData = localStorage.getItem('onboardingFormData');
  if (savedFormData) {
    formData.value = JSON.parse(savedFormData);
    profilePicturePreview.value = formData.value.profilePictureBase64 || defaultProfilePictureBase64;
  }
  loadSkillsCSV();
});

// Formatters
const formatSkillName = (skill) => {
  if (!skill) return '';
  return skill
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatInterestName = (interest) => {
  if (!interest) return '';
  return interest
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Validation
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 0:
      return (
        formData.value.name.trim() &&
        formData.value.skills.length >= 1 &&
        !!formData.value.focusSkill &&
        !!formData.value.level
      );
    case 1:
      return formData.value.interests.length >= 1 && !!formData.value.goal;
    case 2:
      return !!formData.value.location; // Phone is optional
    default:
      return true;
  }
});

const canAddSkill = computed(() => {
  return formData.value.skills.length < 10;
});

// Load skills from CSV
const loadSkillsCSV = async () => {
  try {
    const response = await fetch('/skills.csv');
    const csv = await response.text();
    const parsed = Papa.parse(csv, { header: false });
    allSkills.value = parsed.data
      .flat()
      .map(s => s.trim().toLowerCase())
      .filter(s => s)
      .map(s => toTitleCase(s));
  } catch (err) {
    console.error('Error loading skills CSV:', err);
    error.value = 'Failed to load skills. Please try again.';
  }
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Skill Handling
const searchSkills = () => {
  const term = skillSearch.value.trim().toLowerCase();
  if (!term) {
    filteredSkills.value = [];
    return;
  }
  filteredSkills.value = allSkills.value
    .filter(skill => skill.toLowerCase().includes(term) && !formData.value.skills.includes(skill))
    .slice(0, 10);
};

const selectSkill = (skill) => {
  if (formData.value.skills.length >= 10) return;
  const formatted = toTitleCase(skill);
  if (!formData.value.skills.includes(formatted)) {
    formData.value.skills.push(formatted);
  }
  skillSearch.value = '';
  filteredSkills.value = [];
};

const handleAddSkill = () => {
  const newSkill = toTitleCase(skillSearch.value.trim());
  if (newSkill && !formData.value.skills.includes(newSkill)) {
    if (formData.value.skills.length < 10) {
      formData.value.skills.push(newSkill);
    }
  }
  skillSearch.value = '';
  filteredSkills.value = [];
};

const removeSkill = (skill) => {
  formData.value.skills = formData.value.skills.filter(s => s !== skill);
  if (formData.value.focusSkill === skill) {
    formData.value.focusSkill = null;
  }
};

// Interest Handling
const toggleInterest = (interest) => {
  const index = formData.value.interests.indexOf(interest);
  if (index === -1) {
    formData.value.interests.push(interest);
  } else {
    formData.value.interests.splice(index, 1);
  }
};

// Profile Picture Handling with Compression
const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    formData.value.profilePictureBase64 = null; // Set to null if no file
    profilePicturePreview.value = defaultProfilePictureBase64;
    return;
  }

  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image size must be less than 5MB.';
    return;
  }

  try {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 300,
        maxHeight: 300,
        mimeType: 'image/jpeg',
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      const base64SizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith('==') ? 2 : 1);
      if (base64SizeInBytes > 1048576) {
        error.value = 'Compressed image is too large. Please upload a smaller image.';
        return;
      }
      formData.value.profilePictureBase64 = base64String;
      profilePicturePreview.value = base64String;
    };
    reader.onerror = () => {
      error.value = 'Failed to process the image. Please try again.';
    };
    reader.readAsDataURL(compressedFile);
  } catch (err) {
    console.error('Error compressing image:', err);
    error.value = 'Failed to compress the image. Please try again.';
    formData.value.profilePictureBase64 = null; // Reset to null on error
    profilePicturePreview.value = defaultProfilePictureBase64;
  }
};

// Navigation
const nextStep = async () => {
  if (!isCurrentStepValid.value) {
    error.value = 'Please complete the current step before proceeding.';
    return;
  }

  // Save form data to localStorage
  localStorage.setItem('onboardingFormData', JSON.stringify(formData.value));

  if (currentStep.value === steps.value.length - 1) {
    await submitForm();
  } else {
    currentStep.value++;
    error.value = null; // Clear error on step change
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    error.value = null; // Clear error on step change
  }
};

// Form Submission
const submitForm = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const user = auth.currentUser;
    console.log('Authenticated user:', user);
    if (!user || !user.uid) {
      throw new Error('User not authenticated properly.');
    }

    const userDoc = {
      name: formData.value.name || '',
      email: formData.value.email || '',
      skills: formData.value.skills || [],
      focusSkill: formData.value.focusSkill || null,
      level: formData.value.level || null,
      interests: formData.value.interests || [],
      goal: formData.value.goal || '',
      location: formData.value.location || '',
      phone: formData.value.phone || '', // Phone is optional
      about: formData.value.about || '',
      profilePictureBase64: formData.value.profilePictureBase64 || null,
      xp: 0,
      watchedVideos: [],
      lessonsCompleted: [],
      courseProgress: {},
      completion_dates: null,
      createdAt: new Date(),
      user_id: user.uid,
      created_by: user.uid,
      updatedAt: new Date(),
      onboardingComplete: true,
    };

    console.log('User document to save:', JSON.stringify(userDoc, null, 2));
    await setDoc(doc(db, 'users', user.uid), userDoc);
    localStorage.removeItem('onboardingFormData'); // Clear localStorage after successful submission
    router.push('/dashboard');
  } catch (err) {
    console.error('Error saving user data:', err);
    error.value = `Save failed: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Tailwind CSS is used inline, so no additional styles are needed here */

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>