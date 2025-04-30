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
      <div class="onboarding-container">
        <!-- Progress Line -->
        <div class="progress-line">
          <div class="progress-track">
            <div 
              class="progress-fill"
              :style="{ width: `${Math.round(((currentStep + 1) / steps.length) * 100)}%` }"
            ></div>
          </div>
          <span class="progress-text">
            {{ Math.round(((currentStep + 1) / steps.length) * 100) }}%
          </span>
        </div>

        <!-- Question Wrapper -->
        <transition name="fade" mode="out-in">
          <div :key="currentStep" class="mb-4">
            <!-- Step 1: Skills -->
            <div v-if="currentStep === 0">
              <h4>What are your top skills? (Max 10)</h4>
              <div class="skill-selector">
                <div class="selected-skills">
                  <span
                    v-for="(skill, index) in formData.skills"
                    :key="index"
                    class="skill-tag"
                    @click="removeSkill(skill)"
                  >
                    {{ formatSkillName(skill) }}
                  </span>
                  <p v-if="formData.skills.length >= 10" class="max-skills">
                    You've reached the max of 10 skills.
                  </p>
                </div>
                <div class="skill-input-container">
                  <input
                    type="text"
                    v-model="skillSearch"
                    placeholder="Type a skill..."
                    @input="searchSkills"
                    @keydown.enter.prevent="handleAddSkill"
                    class="skill-input"
                  />
                  <button
                    class="add-skill-button"
                    @click="handleAddSkill"
                    :disabled="!canAddSkill || !skillSearch.trim()"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>

                <transition name="fade">
                  <ul v-if="filteredSkills.length && skillSearch" class="skill-suggestions">
                    <li
                      v-for="(skill, index) in filteredSkills"
                      :key="index"
                      @click="selectSkill(skill)"
                    >
                      {{ formatSkillName(skill) }}
                    </li>
                  </ul>
                </transition>
              </div>
            </div>

              <!-- Step 2: Focus Skill -->
        <div v-else-if="currentStep === 1">
          <h4>Which skill do you want to focus on most?</h4>
         <div class="input-wrapper"> 
          <select class="form-select input" v-model="formData.focusSkill" required>
            <option disabled value="">Select one</option>
            <option v-for="(skill, index) in formData.skills" :key="index" :value="skill">
              {{ skill }}
            </option>
          </select>
        </div></div>

<!-- Step 3: Level -->
<div v-else-if="currentStep === 2">
  <h4>What's your current experience level?</h4>
  <div class="input-wrapper">
    <select 
      class="form-select input" 
      v-model="formData.level" 
      required
    >
      <option disabled value="">Choose</option>
      <option>Beginner</option>
      <option>Intermediate</option>
      <option>Advanced</option>
    </select>
  </div>
</div>

<!-- Step 4: Interests -->
<div v-else-if="currentStep === 3">
  <h4>What are your interests?</h4>
  <div class="interests-container">
    <span 
      v-for="interest in allInterests" 
      :key="interest" 
      class="interest-badge"
      :class="{ 'selected': formData.interests?.includes(interest) }" 
      @click="toggleInterest(interest)"
    >
      {{ formatInterestName(interest) }}
    </span>
  </div>
</div>

<!-- Step 5: Goal -->
<div v-else-if="currentStep === 4">
  <h4>What's your main goal right now?</h4>
  <div class="input-wrapper">
    <input
      type="text"
      class="styled-input"
      v-model="formData.goal"
      placeholder="Your goal..."
      required
    />
  </div>
</div>

<!-- Step 6: Location -->
<div v-else-if="currentStep === 5">
  <h4>Where are you based?</h4>
  <div class="input-wrapper">
    <input
      type="text"
      class="styled-input"
      v-model="formData.location"
      placeholder="Your city or region"
      required
    />
  </div>
</div>

<!-- Step 7: Phone Number -->
<div v-else-if="currentStep === 6">
  <h4>What's your phone number?</h4>
  <div class="input-wrapper">
    <div class="phone-input-group">
      <span class="country-code">+237</span>
      <input
        type="tel"
        class="inputs"
        v-model="formData.phone"
        placeholder="Enter number"
        pattern="[0-9]{9}"
        required
      />
    </div>
    <small class="hint-text">9-digit Cameroon number (e.g. 612345678)</small>
  </div>
</div>

<!-- Step 8: About -->
<div v-else-if="currentStep === 7">
  <h4>Tell us something about you (optional)</h4>
  <div class="input-wrapper">
    <textarea
      class="styled-textarea"
      v-model="formData.about"
      rows="4"
      placeholder="Say something cool..."
    ></textarea>
  </div>
</div>
</div>
</transition>

        <!-- Navigation Buttons at bottom -->
        <div class="navigation-buttons">
          <button 
            class="nav-button back-button" 
            @click="prevStep" 
            :disabled="currentStep === 0"
          >
            Back
          </button>
          <button 
            class="nav-button next-button" 
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import Papa from 'papaparse'


const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const isLoading = ref(false);

const formatSkillName = (skill) => {
  if (!skill) return ''
  return skill.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
};

const formatInterestName = (interest) => {
  if (!interest) return ''
  return interest.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
// Progress tracking
const currentStep = ref(0)
const steps = ref([
  'skills',
  'focusSkill',
  'level',
  'interests',
  'goal',
  'location',
  'phone',
  'about'
])

// Form data
const formData = ref({
  
  name: auth.currentUser?.displayName || '',
  email: auth.currentUser?.email || '',
  skills: [],
  focusSkill: '',
  level: '',
  interests: [],
  goal: '',
  location: '',
  phone: '',
  about: '',
  xp: 0,
  watchedVideos: []
})

// Skill selection
const allSkills = ref([])
const skillSearch = ref('')
const filteredSkills = ref([])

// Interest selection
const allInterests = ref(['Content Marketing', 'Digital Marketing', 'Facebook', 'Instagram', 'Marketing', 'Politics', 'Social Media', 'Social Media Marketing', 'Tech', 'Technology', 'Twitter', 'Business', 'Entrepreneurship', 'Leadership', 'Life', 'Life Lessons', 'Marketing', 'Productivity', 'Self Improvement', 'Startup', 'Venture Capital', 'Atheism', 'Christianity', 'Faith', 'God', 'Islam', 'Philosophy', 'Politics', 'Religion', 'Spirituality'])

// Validation
const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 0: return formData.value.skills.length >= 1
    case 1: return !!formData.value.focusSkill
    case 2: return !!formData.value.level
    case 3: return formData.value.interests.length >= 1
    case 4: return !!formData.value.goal
    case 5: return !!formData.value.location
    case 6: return /^[0-9]{9}$/.test(formData.value.phone)
    default: return true
  }
})
const canAddSkill = computed(()=> {
  return formData.value.skills.length < 10;
});



onMounted(async () => {
  await loadSkillsCSV()
})

const loadSkillsCSV = async () => {
  try {
    const response = await fetch('/skills.csv')
    const csv = await response.text()
    const parsed = Papa.parse(csv, { header: false })
    allSkills.value = parsed.data
      .flat()
      .map(s => s.trim().toLowerCase())
      .filter(s => s)
      .map(s => toTitleCase(s))
  } catch (error) {
    console.error('Error loading skills CSV:', error)
  }
}

const toTitleCase = (str) => {
  return str.replace(/wS*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

const searchSkills = () => {
  const term = skillSearch.value.trim().toLowerCase()
  if (!term) {
    filteredSkills.value = []
    return
  }

  filteredSkills.value = allSkills.value
    .filter(skill => 
      skill.toLowerCase().includes(term) &&
      !formData.value.skills.includes(skill)
    )
    .slice(0, 10)
}

const selectSkill = (skill) => {
  if (formData.value.skills.length >= 10) return
  const formatted = toTitleCase(skill)
  if (!formData.value.skills.includes(formatted)) {
    formData.value.skills.push(formatted)
  }
  skillSearch.value = ''
  filteredSkills.value = []
}

const handleAddSkill = () => {
  const newSkill = toTitleCase(skillSearch.value.trim())
  if (newSkill && !formData.value.skills.includes(newSkill)) {
    if (formData.value.skills.length < 10) {
      formData.value.skills.push(newSkill)
    }
  }
  skillSearch.value = ''
  filteredSkills.value = []
}

const removeSkill = (skill) => {
  formData.value.skills = formData.value.skills.filter(s => s !== skill)
}

const toggleInterest = (interest) => {
  const index = formData.value.interests.indexOf(interest)
  if (index === -1) {
    formData.value.interests.push(interest)
  }
  else {
    formData.value.interests.splice(index,1)
  }


}

// Navigation
const nextStep = async () => {
  if (!isCurrentStepValid.value) {
    alert('Please complete the current step before proceeding')
    return
  }

  if (currentStep.value === steps.value.length - 1) {
    await submitForm()
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

// Firebase submission
const submitForm = async () => {
  isLoading.value = true;
  try {
    const user = auth.currentUser
    if (!user) throw new Error('User not authenticated')

    await setDoc(doc(db, 'users', user.uid), { 
      ...formData.value,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true })

    router.push('/dashboard')
  } catch (error) {
    console.error('Error saving user data:', error)
    alert('Error saving profile. Please try again.')
  }
  finally {
    isLoading.value = false; // Hide loader when the form is done
  }
  return {formatSkillName, formatInterestName}
}
</script>


<style scoped>
.container {
  display: flex;
  padding: 40px;
  align-items: flex-start;
  min-height: 100vh;
}

.left-column {
  position: sticky;
  top: 40px;
  flex: 1;
  padding: 20px;
  margin-right: 40px;
}

.right-column {
  flex: 1;
  padding: 20px;
}

.onboarding-container {
  max-width: 600px;
  margin: 0 auto;
}

/* Progress Line */
.progress-line {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fe572a;
  transition: width 0.5s ease;
}

.progress-text {
  margin-left: 15px;
  font-weight: bold;
  color: #fe572a;
}

/* Skill Input */
.skill-input-container {
  position: relative;
  display: flex;
  margin-top: 15px;
}

.skill-input{
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #fe572a;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.add-skill-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 18px;
  padding: 5px 10px;
  transition: all 0.3s ease;
}

.add-skill-button:not(:disabled) {
  color: #fe572a;
  cursor: pointer;
}

.add-skill-button:disabled {
  cursor: not-allowed;
}

/* Skill Tags */
.selected-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.skill-tag {
  display: inline-block;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-tag:hover {
  background: #e9ecef;
}

.max-skills {
  color: #fe572a;
  font-size: 14px;
  margin-top: 8px;
}

/* Skill Suggestions */
.skill-suggestions {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  margin-top: 5px;
  padding: 0;
  list-style: none;
}

.skill-suggestions li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.skill-suggestions li:hover {
  background: #f5f5f5;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  width: 100%;
}

.nav-button {
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.next-button {
  background: #fe572a;
  color: white;
  border: none;
}

.next-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Loader */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 20px;
  }
  
  .left-column {
    position: static;
    margin-right: 0;
    margin-bottom: 30px;
  }
  .styled-input,
  .styled-textarea {
    padding: 10px 14px;
    font-size: 0.95rem;
  }

  h4 {
    font-size: 1rem;
  }
}

.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.interest-badge {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  color: #4b5563;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interest-badge:hover {
  background-color: #e5e7eb;
}

.interest-badge.selected {
  background-color: #fe572a;
  color: white;
  border-color: #fe572a;
}

.input-wrapper {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  
}

.input-wrapper .inputs {
  padding: 10px;
  border: 2px solid #fe572a;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

h4 {
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
}

/* Text Input Styles */
.styled-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.styled-input:focus {
  outline: none;
  border-color: #fe572a;
  box-shadow: 0 0 0 3px rgba(254, 87, 42, 0.2);
}

/* Phone Input Group */
.phone-input-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.country-code {
  padding: 0 12px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-right: none;
  border-radius: 8px 0 0 8px;
  height: 46px;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #4a5568;
}

/* Textarea Styles */
.styled-textarea{
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.styled-textarea:focus {
  outline: none;
  border-color: #fe572a;
  box-shadow: 0 0 0 3px rgba(254, 87, 42, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .interests-container {
    gap: 6px;
  }
  
  .interest-badge {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>