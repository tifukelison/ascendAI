<!-- /frontend/src/components/Onboarding.vue -->
<template>
  <!-- Loading Overlay -->
  <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div class="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
  </div>

  <!-- Form Container -->
  <div class="p-6 md:p-10 min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto">
      <h1 class="font-crimson text-3xl md:text-4xl text-dark mb-6">Set Up Your Profile</h1>
      <p class="font-lato text-dark text-base mb-8">
        Let’s get started! Fill out the details below to kickstart your learning journey.
      </p>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 text-red-700 font-lato p-4 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Name -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Your Name</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Enter your full name to personalize your experience.</p>
          <input
            type="text"
            v-model="formData.name"
            placeholder="E.g., Jane Doe"
            class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        <hr class="border-gray-200">

        <!-- Skills -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Your Top Skills (Max 10)</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Add skills you’re proficient in or want to learn.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="skill in formData.skills"
              :key="skill"
              class="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-full font-lato text-sm text-dark cursor-pointer hover:bg-gray-200 transition-all duration-200"
              @click="removeSkill(skill)"
            >
              {{ formatSkillName(skill) }}
            </span>
            <p v-if="formData.skills.length >= 10" class="text-primary font-lato text-sm mt-2 w-full">
              Maximum of 10 skills reached.
            </p>
          </div>
          <div class="relative">
            <input
              type="text"
              v-model="skillSearch"
              placeholder="Search skills (e.g., Python, Design)"
              @input="searchSkills"
              @keydown.enter.prevent="addSkill"
              class="w-full p-3 border-2 border-primary rounded-lg font-lato text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            <button
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-all duration-200"
              @click="addSkill"
              :disabled="!canAddSkill || !skillSearch.trim()"
            >
              <i class="fas fa-plus"></i>
            </button>
            <transition name="fade">
              <ul
                v-if="filteredSkills.length && skillSearch"
                class="absolute w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 p-0 list-none"
              >
                <li
                  v-for="skill in filteredSkills"
                  :key="skill"
                  @click="selectSkill(skill)"
                  class="p-3 cursor-pointer hover:bg-gray-100 font-lato text-dark transition-all duration-200"
                >
                  {{ formatSkillName(skill) }}
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <!-- Focus Skill -->
        <div v-if="formData.skills.length">
          <h4 class="font-crimson text-xl text-dark mb-2">Focus Skill</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Choose one skill to prioritize for challenges.</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in formData.skills"
              :key="skill"
              @click="formData.focusSkill = skill"
              class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all duration-200"
              :class="formData.focusSkill === skill ? 'bg-[#fe572a] text-white border-primary' : 'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200'"
            >
              {{ formatSkillName(skill) }}
            </span>
          </div>
        </div>

        <!-- Experience Level -->
        <div v-if="formData.focusSkill">
          <h4 class="font-crimson text-xl text-dark mb-2">Experience Level</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Select your current level for {{ formatSkillName(formData.focusSkill) }}.</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="level in levels"
              :key="level"
              @click="formData.level = level"
              class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all duration-200"
              :class="formData.level === level ? 'bg-[#fe572a] text-white border-primary' : 'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200'"
            >
              {{ level }}
            </span>
          </div>
        </div>

        <hr class="border-gray-200">

        <!-- Interests -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Your Interests</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Pick topics you’re passionate about.</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="interest in allInterests"
              :key="interest"
              @click="toggleInterest(interest)"
              class="inline-block px-4 py-2 border rounded-full font-lato text-sm cursor-pointer transition-all duration-200"
              :class="formData.interests.includes(interest) ? 'bg-[#fe572a] text-white border-primary' : 'bg-gray-100 border-gray-300 text-dark hover:bg-gray-200'"
            >
              {{ formatInterestName(interest) }}
            </span>
          </div>
        </div>

        <!-- Goal -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Your Main Goal</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">What do you aim to achieve with {{ formData.focusSkill ? formatSkillName(formData.focusSkill) : 'your skill' }}?</p>
          <input
            type="text"
            v-model="formData.goal"
            placeholder="E.g., Build a portfolio website"
            class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        <hr class="border-gray-200">

        <!-- Location -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Your Location</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Enter your city or region.</p>
          <input
            type="text"
            v-model="formData.location"
            placeholder="E.g., Lagos, Nigeria"
            class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        <!-- Profile Header -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Create Your Profile Header (Like LinkedIn)</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Craft a short headline about yourself (optional, max 255 characters).</p>
          <textarea
            v-model="formData.about"
            placeholder="E.g., Aspiring Data Scientist | Passionate about AI"
            rows="3"
            maxlength="255"
            class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
          ></textarea>
          <p class="font-lato text-sm text-gray-500 mt-1">{{ formData.about.length || 0 }}/255 characters</p>
        </div>

        <!-- Profile Picture -->
        <div>
          <h4 class="font-crimson text-xl text-dark mb-2">Profile Photo (Optional)</h4>
          <p class="font-lato text-sm text-gray-600 mb-2">Upload a photo to enhance your profile (max 6MB).</p>
          <input
            type="file"
            accept="image/*"
            @change="handleProfilePicture"
            class="w-full p-3 border-2 border-gray-300 rounded-lg font-lato text-dark bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary file:hover:bg-primary-100 transition-all duration-200"
          />
          <div v-if="profilePicturePreview" class="mt-4">
            <img
              :src="profilePicturePreview"
              alt="Profile Picture Preview"
              class="w-32 h-32 rounded-lg object-cover border border-gray-200"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-10">
          <button
            type="submit"
            class="w-full py-3 px-6 rounded-lg font-lato text-white font-bold transition-all duration-300 transform hover:-translate-y-1"
            :class="isFormValid && !isLoading ? 'bg-[#fe572a] hover:bg-[#ff8c63]' : 'bg-gray-400 cursor-not-allowed'"
            :disabled="!isFormValid || isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Complete Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Compressor from 'compressorjs';
import Papa from 'papaparse';

// Router
const router = useRouter();

// Default Profile Picture (1x1 gray pixel)
const defaultProfilePictureBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

// State
const isLoading = ref(false);
const error = ref(null);
const formData = ref({
  name: auth.currentUser?.displayName || '',
  email: auth.currentUser?.email || '',
  skills: [],
  focusSkill: null,
  level: null,
  interests: [],
  goal: '',
  location: '',
  about: '',
  profilePictureBase64: defaultProfilePictureBase64,
  xp: 0,
  watchedVideos: [],
  lessonsCompleted: [],
  courseProgress: {},
  completion_dates: null,
});
const skillSearch = ref('');
const filteredSkills = ref([]);
const allSkills = ref([]);
const profilePicturePreview = ref(defaultProfilePictureBase64);
const allInterests = ref([
  'Content Marketing', 'Digital Marketing', 'Facebook', 'Instagram', 'Marketing', 'Politics',
  'Social Media', 'Social Media Marketing', 'Tech', 'Technology', 'Twitter', 'Business',
  'Entrepreneurship', 'Leadership', 'Life', 'Life Lessons', 'Marketing', 'Productivity',
  'Self Improvement', 'Startup', 'Venture Capital', 'Atheism', 'Christianity', 'Faith',
  'God', 'Islam', 'Philosophy', 'Politics', 'Religion', 'Spirituality'
]);
const levels = ref(['Beginner', 'Intermediate', 'Advanced']);

// Form Validation
const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.skills.length >= 1 &&
    formData.value.focusSkill &&
    formData.value.level &&
    formData.value.interests.length >= 1 &&
    formData.value.goal.trim() &&
    formData.value.location.trim()
  );
});

const canAddSkill = computed(() => formData.value.skills.length < 10);

// Load Skills from skills.txt or skills.csv
const loadSkills = async () => {
  try {
    // Try skills.txt first
    try {
      const txtResponse = await fetch('/skills.txt');
      if (txtResponse.ok) {
        const txt = await txtResponse.text();
        allSkills.value = txt
          .split('\n')
          .map(s => s.trim())
          .filter(s => s)
          .map(toTitleCase);
        console.log('Loaded skills from skills.txt:', allSkills.value);
        return;
      }
    } catch (txtError) {
      console.log('skills.txt not found, falling back to skills.csv:', txtError);
    }

    // Fallback to skills.csv
    const csvResponse = await fetch('/skills.csv');
    if (csvResponse.ok) {
      const csv = await csvResponse.text();
      const parsed = Papa.parse(csv, { header: false });
      allSkills.value = parsed.data
        .flat()
        .map(s => s.trim())
        .filter(s => s)
        .map(toTitleCase);
      console.log('Loaded skills from skills.csv:', allSkills.value);
    } else {
      throw new Error('skills.csv not found');
    }
  } catch (err) {
    console.error('Error loading skills:', err);
    error.value = 'Failed to load skills. Please try again later.';
  }
};

// Formatters
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const formatSkillName = (skill) => skill ? toTitleCase(skill) : '';
const formatInterestName = (interest) => interest ? toTitleCase(interest) : '';

// Skill Handling
const searchSkills = () => {
  const term = skillSearch.value.trim().toLowerCase();
  filteredSkills.value = term
    ? allSkills.value
        .filter(skill => skill.toLowerCase().includes(term) && !formData.value.skills.includes(skill))
        .slice(0, 10)
    : [];
};

const selectSkill = (skill) => {
  if (canAddSkill.value) {
    const formatted = toTitleCase(skill);
    if (!formData.value.skills.includes(formatted)) {
      formData.value.skills.push(formatted);
    }
    skillSearch.value = '';
    filteredSkills.value = [];
  }
};

const addSkill = () => {
  const newSkill = toTitleCase(skillSearch.value.trim());
  if (newSkill && !formData.value.skills.includes(newSkill) && canAddSkill.value) {
    formData.value.skills.push(newSkill);
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
  if (formData.value.interests.includes(interest)) {
    formData.value.interests = formData.value.interests.filter(i => i !== interest);
  } else {
    formData.value.interests.push(interest);
  }
};

// Profile Picture Handling
const handleProfilePicture = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    formData.value.profilePictureBase64 = defaultProfilePictureBase64;
    profilePicturePreview.value = defaultProfilePictureBase64;
    return;
  }

  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.';
    return;
  }
  if (file.size > 6 * 1024 * 1024) {
    error.value = 'Image size must be less than 6MB.';
    return;
  }

  const maxBase64Size = 1048576; // 1MB
  let quality = 0.6; // Initial quality
  const minQuality = 0.2; // Minimum quality
  const qualityStep = 0.1; // Quality reduction step

  const compressImage = (file, quality) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality,
        maxWidth: 200,
        maxHeight: 200,
        mimeType: 'image/jpeg',
        success: resolve,
        error: reject,
      });
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  try {
    let compressedFile = await compressImage(file, quality);
    console.log(`Initial compression: quality=${quality}, size=${compressedFile.size} bytes`);

    let base64String = await getBase64(compressedFile);
    let base64SizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith('==') ? 2 : 1);
    console.log(`Initial Base64 size: ${base64SizeInBytes} bytes`);

    // Retry with lower quality if needed
    while (base64SizeInBytes > maxBase64Size && quality > minQuality) {
      quality -= qualityStep;
      console.log(`Retrying compression: quality=${quality}`);
      compressedFile = await compressImage(file, quality);
      console.log(`Retry compression: quality=${quality}, size=${compressedFile.size} bytes`);
      base64String = await getBase64(compressedFile);
      base64SizeInBytes = (base64String.length * 3) / 4 - (base64String.endsWith('==') ? 2 : 1);
      console.log(`Retry Base64 size: ${base64SizeInBytes} bytes`);
    }

    if (base64SizeInBytes > maxBase64Size) {
      error.value = 'Unable to compress image below 1MB. Please upload a smaller image.';
      formData.value.profilePictureBase64 = defaultProfilePictureBase64;
      profilePicturePreview.value = defaultProfilePictureBase64;
      return;
    }

    formData.value.profilePictureBase64 = base64String;
    profilePicturePreview.value = base64String;
    console.log(`Final compression successful: quality=${quality}, Base64 size=${base64SizeInBytes} bytes`);
  } catch (err) {
    console.error('Error compressing image:', err);
    error.value = 'Failed to compress image. Please try again.';
    formData.value.profilePictureBase64 = defaultProfilePictureBase64;
    profilePicturePreview.value = defaultProfilePictureBase64;
  }
};

// Form Submission
const submitForm = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill all required fields.';
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    const user = auth.currentUser;
    if (!user || !user.uid) {
      throw new Error('User not authenticated.');
    }

    const userDoc = {
      name: formData.value.name,
      email: formData.value.email,
      skills: formData.value.skills,
      focusSkill: formData.value.focusSkill,
      level: formData.value.level,
      interests: formData.value.interests,
      goal: formData.value.goal,
      location: formData.value.location,
      about: formData.value.about || '',
      profilePictureBase64: formData.value.profilePictureBase64 !== defaultProfilePictureBase64 ? formData.value.profilePictureBase64 : null,
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

    console.log('Saving user document:', userDoc);
    await setDoc(doc(db, 'users', user.uid), userDoc);
    localStorage.removeItem('onboardingFormData');
    router.push('/dashboard');
  } catch (err) {
    console.error('Error saving user data:', err);
    error.value = `Failed to save profile: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(() => {
  // Load saved form data
  const savedFormData = localStorage.getItem('onboardingFormData');
  if (savedFormData) {
    formData.value = { ...formData.value, ...JSON.parse(savedFormData) };
    profilePicturePreview.value = formData.value.profilePictureBase64 || defaultProfilePictureBase64;
  }
  loadSkills();
});

// Persist form data
watch(formData, (newData) => {
  localStorage.setItem('onboardingFormData', JSON.stringify(newData));
}, { deep: true });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background: #fe572a;
  border-radius: 3px;
}
ul::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>