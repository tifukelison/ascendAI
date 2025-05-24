<template>
  <div class="container mx-auto p-4">
    <h1 class="font-crimson text-3xl text-dark mb-6">Browse Courses</h1>

    <!-- Course List View -->
    <div v-if="view === 'list'">
      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          :disabled="loading || !isOnline"
          class="px-4 py-2 rounded-full font-lato text-sm transition-colors duration-200"
          :class="{
            'bg-[#fe572a] text-white': selectedCategories.includes(category),
            'bg-gray-200 text-dark': !selectedCategories.includes(category),
            'opacity-50 cursor-not-allowed': loading || !isOnline,
          }"
        >
          {{ category }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="border-t-4 border-primary rounded-full animate-spin w-8 h-8"></div>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 text-red-700 font-lato p-4 rounded-lg mb-4">
        <p class="mb-2">{{ error.message }}</p>
        <button
          v-if="error.retryAction"
          @click="error.retryAction"
          :disabled="!isOnline"
          class="underline text-red-900 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      </div>
      <!-- No Courses -->
      <div v-else-if="courses.length === 0" class="font-lato text-dark text-center">
        No courses available. Please check back later!
      </div>
      <!-- Course List -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="course in paginatedCourses"
            :key="course.id"
            @click="selectCourse(course.id)"
            class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <h2 class="font-crimson text-xl font-bold mb-2" style="color: #fe572a;">
              {{ course.title }}
            </h2>
            <p class="font-lato text-sm text-dark mb-2">{{ course.description }}</p>
            <p class="font-lato text-sm text-dark mb-2">{{ course.xpTotal }} XP</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                class="bg-primary h-2.5 rounded-full transition-width duration-300"
                :style="{ width: getProgressPercentage(course.id) + '%' }"
              ></div>
            </div>
            <button
              class="w-full bg-[#fe572a] text-white font-lato py-2 rounded hover:bg-opacity-90 transition-colors duration-200"
              :disabled="!isOnline"
              :class="{ 'opacity-50 cursor-not-allowed': !isOnline }"
            >
              {{ getProgress(course.id) > 0 ? 'Continue' : 'Start' }}
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="mt-10 flex justify-center items-center" v-if="courses.length > 0">
          <button
            @click="prevPage"
            :disabled="currentPage === 1 || loading || !isOnline"
            class="font-semibold py-2 px-4 rounded-l transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :style="{ backgroundColor: currentPage === 1 ? '#E2E8F0' : '#fe572a', color: currentPage === 1 ? '#22252a' : 'white' }"
            :class="{ 'hover:opacity-80': currentPage !== 1 }"
          >
            <span v-if="loading && isChangingToPrev" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
            <span v-else>Prev</span>
          </button>
          <span class="px-5 py-2 text-gray-700 bg-gray-100" style="color: #22252a;">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || loading || !isOnline"
            class="font-semibold py-2 px-4 rounded-r transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :style="{ backgroundColor: currentPage === totalPages ? '#E2E8F0' : '#fe572a', color: currentPage === totalPages ? '#22252a' : 'white' }"
            :class="{ 'hover:opacity-80': currentPage !== totalPages }"
          >
            <span v-if="loading && !isChangingToPrev" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
            <span v-else>Next</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Course Detail View (Lessons List) -->
    <div v-else-if="view === 'detail'">
      <button @click="backToList" class="mb-4 font-lato text-primary" :disabled="!isOnline" :class="{ 'opacity-50 cursor-not-allowed': !isOnline }">
        ← Back to Courses
      </button>
      <div v-if="loadingDetail" class="flex justify-center items-center h-64">
        <div class="border-t-4 border-primary rounded-full animate-spin w-8 h-8"></div>
      </div>
      <div v-else-if="errorDetail" class="bg-red-100 text-red-700 font-lato p-4 rounded-lg mb-4">
        <p class="p-2">{{ errorDetail.message }}</p>
        <button
          v-if="errorDetail.retryAction"
          @click="errorDetail.retryAction"
          :disabled="!isOnline"
          class="underline text-red-900 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      </div>
      <div v-else>
        <h1 class="font-crimson text-3xl text-dark mb-4">{{ selectedCourse?.title }}</h1>
        <div v-if="computedStaleProgress" class="bg-yellow-100 p-4 mb-4 rounded font-lato flex justify-between items-center">
          <span>Content updated—your progress is preserved, but we recommend revisiting.</span>
          <button @click="dismissStaleProgress" class="text-primary underline" :disabled="!isOnline" :class="{ 'opacity-50 cursor-not-allowed': !isOnline }">
            Dismiss
          </button>
        </div>

        <!-- Lessons List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(lesson, index) in selectedCourse?.lessons"
            :key="lesson.id"
            @click="selectLesson(index)"
            class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex justify-between items-center"
            :class="{ 'opacity-50 cursor-not-allowed': !isOnline }"
          >
            <div>
              <h3 class="font-crimson text-lg text-dark">{{ lesson.title }}</h3>
              <p class="font-lato text-sm text-dark">{{ lesson.description || 'No description available' }}</p>
              <p class="font-lato text-sm text-dark">{{ lesson.xpReward }} XP • {{ getReadingTime(lesson.content) }} min read</p>
            </div>
            <div v-if="progress?.lessonsCompleted?.includes(lesson.id)" class="text-green-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lesson Detail View -->
    <div v-else-if="view === 'lesson'">
      <button @click="backToCourse" class="mb-4 font-lato text-primary" :disabled="!isOnline" :class="{ 'opacity-50 cursor-not-allowed': !isOnline }">
        ← Back to Lessons
      </button>
      <div v-if="loadingDetail" class="flex justify-center items-center h-64">
        <div class="border-t-4 border-primary rounded-full animate-spin w-8 h-8"></div>
      </div>
      <div v-else-if="errorDetail" class="bg-red-100 text-red-700 font-lato p-4 rounded-lg mb-4">
        <p class="mb-2">{{ errorDetail.message }}</p>
        <button
          v-if="errorDetail.retryAction"
          @click="errorDetail.retryAction"
          :disabled="!isOnline"
          class="underline text-red-900 hover:text-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      </div>
      <div v-else>
        <h2 class="font-crimson text-2xl text-dark mb-4">{{ selectedLesson?.title }}</h2>
        <div v-if="selectedLesson?.type === 'text'" class="prose font-lato text-dark mb-6">
          <VueMarkdown :source="selectedLesson.content" />
        </div>
        <div v-if="exercise" class="mt-6">
          <h3 class="font-crimson text-xl text-dark mb-2">Exercise</h3>
          <p class="font-lato text-dark mb-2">{{ exercise.prompt }}</p>
          <p class="font-lato text-dark mb-4 italic">By submitting this exercise, you complete the lesson and earn {{ exercise.xpReward }} XP.</p>
          <div v-if="isLessonCompleted" class="bg-green-100 text-green-700 font-lato p-4 rounded-lg mb-4">
            This lesson is already completed. You have earned {{ exercise.xpReward }} XP.
          </div>
          <textarea
            v-else
            v-model="response"
            :placeholder="exercise ? 'Your response' : 'No exercise available'"
            class="w-full p-2 border rounded font-lato text-dark resize-y mb-4"
            :disabled="!exercise || !isOnline"
            @input="handleInput"
            @beforeunload="checkUnsaved"
          ></textarea>
          <div v-if="!isLessonCompleted" class="flex gap-2">
            <button
              @click="debouncedSubmitExercise"
              :disabled="response.length < 10 || submitting || !exercise || !isOnline"
              class="bg-orange-100 text-orange-800 font-lato py-2 px-4 rounded flex items-center transition-colors duration-200"
              :class="{ 'opacity-50 cursor-not-allowed': response.length < 10 || submitting || !exercise || !isOnline }"
            >
              <span v-if="submitting" class="mr-2">
                <div class="border-t-2 border-white rounded-full animate-spin w-4 h-4"></div>
              </span>
              Submit
            </button>
            <button
              @click="debouncedClearExercise"
              :disabled="submitting || !isOnline"
              class="bg-primary font-lato py-2 px-4 rounded flex items-center transition-colors duration-200"
              :class="{ 'opacity-50 cursor-not-allowed': submitting || !isOnline }"
            >
              Clear
            </button>
          </div>
        </div>
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="font-crimson text-xl text-dark mb-4">Submission Result</h3>
            <p class="font-lato text-dark">You earned +{{ submissionResult.xpAwarded }} XP</p>
            <p class="font-lato text-dark">Gemini Score: {{ submissionResult.score }}/10</p>
            <ul class="font-lato text-dark list-disc pl-5 my-2">
              <li v-for="(tip, index) in submissionResult.tips" :key="index">{{ tip }}</li>
            </ul>
            <button
              @click="showModal = false"
              class="bg-primary text-white font-lato py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc, arrayUnion, increment, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Adjust the import path to your Firebase config
import VueMarkdown from 'vue-markdown-render'; // For rendering Markdown content

export default {
  name: 'Courses',
  components: {
    VueMarkdown,
  },
  setup() {
    // State variables
    const view = ref('list');
    const categories = ref(['All', 'Branding', 'Design', 'Marketing', 'Development', 'Business', 'Lifestyle', 'Copy & Content']);
    const selectedCategories = ref(['All']);
    const courses = ref([]);
    const paginatedCourses = ref([]);
    const currentPage = ref(1);
    const coursesPerPage = 9;
    const totalPages = ref(1);
    const loading = ref(true);
    const isChangingToPrev = ref(false);
    const error = ref(null);
    const selectedCourse = ref(null);
    const progress = ref(null);
    const loadingDetail = ref(false);
    const errorDetail = ref(null);
    const selectedLessonIndex = ref(0);
    const selectedLesson = ref(null);
    const exercise = ref(null);
    const response = ref('');
    const submitting = ref(false);
    const showModal = ref(false);
    const submissionResult = ref(null);
    const staleProgress = ref(true);
    const dismissedStaleProgress = ref(false);
    const isOnline = ref(navigator.onLine);

    // Handle online/offline status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
      if (!isOnline.value) {
        if (view.value === 'list') {
          error.value = { message: 'Error: You are offline. Please check your internet connection.' };
        } else {
          errorDetail.value = { message: 'Error: You are offline. Please check your internet connection.' };
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Fetch all courses from Firestore with pagination support
    const fetchCourses = async () => {
      if (!isOnline.value) {
        error.value = { message: 'Error: You are offline. Please check your internet connection.' };
        loading.value = false;
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        const q = query(collection(db, 'courses'), orderBy('title'));
        const querySnapshot = await getDocs(q);
        courses.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        updatePagination();
      } catch (err) {
        let message = 'Error: Unable to load courses. ';
        let retryAction = fetchCourses;
        if (err.code === 'permission-denied') {
          message += 'You do not have permission to access courses. Please sign in or contact support.';
          retryAction = null;
        } else if (err.code === 'unavailable') {
          message += 'Network issue detected. Please check your connection and try again.';
        } else if (err.code === 'resource-exhausted') {
          message += 'Quota exceeded. Please try again later.';
          retryAction = null;
        } else {
          message += 'An unexpected error occurred. Please try again.';
        }
        error.value = { message, retryAction };
      } finally {
        loading.value = false;
      }
    };

    // Update paginated courses
    const updatePagination = () => {
      const filtered = selectedCategories.value.includes('All')
        ? courses.value
        : courses.value.filter((course) => selectedCategories.value.includes(course.category));
      totalPages.value = Math.ceil(filtered.length / coursesPerPage);
      const start = (currentPage.value - 1) * coursesPerPage;
      const end = start + coursesPerPage;
      paginatedCourses.value = filtered.slice(start, end);
    };

    // Pagination controls
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        isChangingToPrev.value = false;
        currentPage.value++;
        updatePagination();
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        isChangingToPrev.value = true;
        currentPage.value--;
        updatePagination();
      }
    };

    // Filter courses by selected categories
    const filteredCourses = computed(() => {
      if (selectedCategories.value.includes('All')) return courses.value;
      return courses.value.filter((course) => selectedCategories.value.includes(course.category));
    });

    // Category selection
    const selectCategory = (category) => {
      if (!isOnline.value) return;
      if (category === 'All') {
        selectedCategories.value = ['All'];
      } else {
        selectedCategories.value = selectedCategories.value.filter((c) => c !== 'All');
        if (selectedCategories.value.includes(category)) {
          selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
          if (selectedCategories.value.length === 0) selectedCategories.value = ['All'];
        } else {
          selectedCategories.value.push(category);
        }
      }
      currentPage.value = 1;
      updatePagination();
    };

    // Calculate reading time based on word count (200 words per minute)
    const getReadingTime = (content) => {
      if (!content) return 1;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return minutes;
    };

    // Fetch course details and progress when a course is selected
    const selectCourse = async (courseId) => {
      if (!isOnline.value) {
        errorDetail.value = { message: 'Error: You are offline. Please check your internet connection.' };
        return;
      }
      view.value = 'detail';
      loadingDetail.value = true;
      errorDetail.value = null;
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(courseRef);
        if (!courseDoc.exists()) throw new Error('Course not found');

        const courseData = { id: courseDoc.id, ...courseDoc.data() };

        // Validate and fetch lessons
        if (!Array.isArray(courseData.lessons)) throw new Error('Invalid lessons data in course.');
        const lessonDocs = await Promise.all(
          courseData.lessons.map((lessonId) =>
            getDoc(doc(db, 'lessons', lessonId)).then((doc) => {
              if (!doc.exists()) throw new Error(`Lesson ${lessonId} not found`);
              return { id: doc.id, ...doc.data() };
            })
          )
        );
        courseData.lessons = lessonDocs;

        // Calculate course XP as the sum of lesson XPs
        courseData.xpTotal = courseData.lessons.reduce((total, lesson) => total + (lesson.xpReward || 0), 0);

        // Fetch user progress
        if (auth.currentUser) {
          const progressRef = doc(db, 'users', auth.currentUser.uid, 'courseProgress', courseId);
          const progressDoc = await getDoc(progressRef);
          progress.value = progressDoc.exists()
            ? progressDoc.data()
            : { lessonsCompleted: [], xpEarned: 0, version: 0 };
        } else {
          progress.value = { lessonsCompleted: [], xpEarned: 0, version: 0 };
        }

        selectedCourse.value = courseData;
        staleProgress.value = progress.value && selectedCourse.value ? progress.value.version < selectedCourse.value.version : false;
      } catch (err) {
        let message = 'Error: Unable to load course details. ';
        let retryAction = () => selectCourse(courseId);
        if (err.message.includes('Lesson') && err.message.includes('not found')) {
          message += 'One or more lessons are missing. Please contact support.';
          retryAction = null;
        } else if (err.message === 'Course not found') {
          message += 'This course does not exist. Please select another course.';
          retryAction = null;
        } else if (err.message === 'Invalid lessons data in course.') {
          message += 'Course data is corrupted. Please contact support.';
          retryAction = null;
        } else if (err.code === 'permission-denied') {
          message += 'You do not have permission to access this course. Please sign in or contact support.';
          retryAction = null;
        } else if (err.code === 'unavailable') {
          message += 'Network issue detected. Please check your connection and try again.';
        } else if (err.code === 'resource-exhausted') {
          message += 'Quota exceeded. Please try again later.';
          retryAction = null;
        } else {
          message += 'An unexpected error occurred. Please try again.';
        }
        errorDetail.value = { message, retryAction };
      } finally {
        loadingDetail.value = false;
      }
    };

    // Select a lesson
    const selectLesson = async (index) => {
      if (!isOnline.value) {
        errorDetail.value = { message: 'Error: You are offline. Please check your internet connection.' };
        return;
      }
      selectedLessonIndex.value = index;
      selectedLesson.value = selectedCourse.value?.lessons[index];
      view.value = 'lesson';
      loadingDetail.value = true;
      errorDetail.value = null;
      try {
        // Fetch associated exercise if it exists
        if (selectedLesson.value?.exerciseId) {
          const exerciseRef = doc(db, 'exercises', selectedLesson.value.exerciseId);
          const exerciseDoc = await getDoc(exerciseRef);
          if (!exerciseDoc.exists()) throw new Error(`Exercise ${selectedLesson.value.exerciseId} not found`);
          exercise.value = exerciseDoc.data();
        } else {
          exercise.value = null;
        }
      } catch (err) {
        let message = 'Error: Unable to load lesson details. ';
        let retryAction = () => selectLesson(index);
        if (err.message.includes('Exercise') && err.message.includes('not found')) {
          message += 'The associated exercise is missing. You can still complete the lesson without it.';
          retryAction = null;
          exercise.value = null; // Allow lesson to load without exercise
        } else if (err.code === 'permission-denied') {
          message += 'You do not have permission to access this lesson. Please sign in or contact support.';
          retryAction = null;
        } else if (err.code === 'unavailable') {
          message += 'Network issue detected. Please check your connection and try again.';
        } else if (err.code === 'resource-exhausted') {
          message += 'Quota exceeded. Please try again later.';
          retryAction = null;
        } else {
          message += 'An unexpected error occurred. Please try again.';
        }
        errorDetail.value = { message, retryAction };
      } finally {
        loadingDetail.value = false;
      }
    };

    // Check if the current lesson is completed
    const isLessonCompleted = computed(() => {
      return progress.value?.lessonsCompleted?.includes(selectedLesson.value?.id);
    });

    // Update user XP and course progress atomically using a transaction
    const updateProgressAndXP = async (xpToAdd, lessonId) => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const progressRef = doc(db, 'users', auth.currentUser.uid, 'courseProgress', selectedCourse.value.id);

        await runTransaction(db, async (transaction) => {
          const progressDoc = await transaction.get(progressRef);
          const userDoc = await transaction.get(userRef);

          // Check if lesson is already completed
          const currentProgress = progressDoc.exists() ? progressDoc.data() : { lessonsCompleted: [], xpEarned: 0, version: 0 };
          if (currentProgress.lessonsCompleted.includes(lessonId)) {
            throw new Error('Lesson already completed');
          }

          // Update course progress
          transaction.set(progressRef, {
            lessonsCompleted: arrayUnion(lessonId),
            xpEarned: increment(xpToAdd),
            version: currentProgress.version || 1,
          }, { merge: true });

          // Update user XP
          const currentXP = userDoc.exists() && userDoc.data().xp ? userDoc.data().xp : 0;
          transaction.set(userRef, { xp: currentXP + xpToAdd }, { merge: true });

          // Update local state
          progress.value.lessonsCompleted = [...(progress.value?.lessonsCompleted || []), lessonId];
          progress.value.xpEarned = (progress.value?.xpEarned || 0) + xpToAdd;
        });
      } catch (err) {
        console.error('Error updating progress and XP:', err);
        if (err.message === 'Lesson already completed') {
          errorDetail.value = {
            message: 'Error: This lesson has already been completed. You cannot earn XP again.',
            retryAction: null,
          };
        } else {
          errorDetail.value = {
            message: 'Error: Failed to update your progress and XP. Please try again.',
            retryAction: () => updateProgressAndXP(xpToAdd, lessonId),
          };
        }
      }
    };

    // Return to the course list
    const backToList = () => {
      if (!isOnline.value) return;
      view.value = 'list';
      selectedCourse.value = null;
      progress.value = null;
      selectedLessonIndex.value = 0;
      selectedLesson.value = null;
      exercise.value = null;
      response.value = ''; // Clear response to prevent resubmission
      errorDetail.value = null;
    };

    // Return to the lessons list
    const backToCourse = () => {
      if (!isOnline.value) return;
      view.value = 'detail';
      selectedLesson.value = null;
      exercise.value = null;
      response.value = ''; // Clear response to prevent resubmission
      errorDetail.value = null;
    };

    // Dismiss stale progress message
    const dismissStaleProgress = () => {
      if (!isOnline.value) return;
      dismissedStaleProgress.value = true;
      staleProgress.value = false;
    };

    // Computed properties
    const computedStaleProgress = computed(() => staleProgress.value && !dismissedStaleProgress.value);

    const getProgress = (courseId) => {
      if (!progress.value || selectedCourse?.value?.id !== courseId) return 0;
      const xpEarned = progress.value.xpEarned || 0;
      const xpTotal = selectedCourse.value?.xpTotal || 1;
      return xpEarned / xpTotal;
    };

    const getProgressPercentage = (courseId) => Math.min(getProgress(courseId) * 100, 100);

    // Debounce utility to prevent rapid submissions
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };

    // Handle exercise submission
    const submitExercise = async () => {
      if (!exercise.value) return;
      if (!isOnline.value) {
        errorDetail.value = { message: 'Error: You are offline. Please check your internet connection.' };
        return;
      }
      if (!auth.currentUser) {
        errorDetail.value = { message: 'Error: You are not signed in. Please sign in to submit exercises.' };
        return;
      }
      if (isLessonCompleted.value) {
        errorDetail.value = { message: 'Error: This lesson has already been completed. You cannot submit again.' };
        return;
      }

      submitting.value = true;
      try {
        // Mock submission logic (replace with actual backend call)
        submissionResult.value = { xpAwarded: exercise.value.xpReward, score: 8, tips: ['Tip 1', 'Tip 2'] };
        showModal.value = true;

        // Update user XP and course progress atomically
        const xpToAdd = exercise.value.xpReward;
        await updateProgressAndXP(xpToAdd, selectedLesson.value.id);

        response.value = '';
      } catch (err) {
        let message = 'Error: Failed to submit exercise. ';
        let retryAction = submitExercise;
        if (err.code === 'permission-denied') {
          message += 'You do not have permission to submit exercises. Please sign in or contact support.';
          retryAction = null;
        } else if (err.code === 'unavailable') {
          message += 'Network issue detected. Please check your connection and try again.';
        } else if (err.code === 'resource-exhausted') {
          message += 'Quota exceeded. Please try again later.';
          retryAction = null;
        } else {
          message += 'An unexpected error occurred. Please try again.';
        }
        errorDetail.value = { message, retryAction };
      } finally {
        submitting.value = false;
      }
    };

    // Debounced submit exercise to prevent rapid submissions
    const debouncedSubmitExercise = debounce(submitExercise, 1000);

    // Clear exercise (mark lesson as completed without submission)
    const clearExercise = async () => {
      if (progress.value?.lessonsCompleted?.includes(selectedLesson.value?.id)) return;
      if (!isOnline.value) {
        errorDetail.value = { message: 'Error: You are offline. Please check your internet connection.' };
        return;
      }
      if (!auth.currentUser) {
        errorDetail.value = { message: 'Error: You are not signed in. Please sign in to complete lessons.' };
        return;
      }
      if (isLessonCompleted.value) {
        errorDetail.value = { message: 'Error: This lesson has already been completed. You cannot clear again.' };
        return;
      }

      submitting.value = true;
      try {
        // If there's an exercise, use its XP; otherwise, use the lesson's XP
        const xpToAdd = exercise.value ? exercise.value.xpReward : selectedLesson.value.xpReward;
        await updateProgressAndXP(xpToAdd, selectedLesson.value.id);
      } catch (err) {
        let message = 'Error: Failed to clear exercise. ';
        let retryAction = clearExercise;
        if (err.code === 'permission-denied') {
          message += 'You do not have permission to complete lessons. Please sign in or contact support.';
          retryAction = null;
        } else if (err.code === 'unavailable') {
          message += 'Network issue detected. Please check your connection and try again.';
        } else if (err.code === 'resource-exhausted') {
          message += 'Quota exceeded. Please try again later.';
          retryAction = null;
        } else {
          message += 'An unexpected error occurred. Please try again.';
        }
        errorDetail.value = { message, retryAction };
      } finally {
        submitting.value = false;
      }
    };

    // Debounced clear exercise to prevent rapid submissions
    const debouncedClearExercise = debounce(clearExercise, 1000);

    // Handle unsaved changes warning
    const checkUnsaved = (event) => {
      if (response.value && !isLessonCompleted.value) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    const handleInput = () => {
      window.addEventListener('beforeunload', checkUnsaved);
    };

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', checkUnsaved);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    });

    onMounted(() => {
      fetchCourses();
    });

    return {
      view,
      categories,
      selectedCategories,
      courses,
      paginatedCourses,
      currentPage,
      totalPages,
      loading,
      isChangingToPrev,
      error,
      selectedCourse,
      progress,
      loadingDetail,
      errorDetail,
      selectedLessonIndex,
      selectedLesson,
      exercise,
      response,
      submitting,
      showModal,
      submissionResult,
      computedStaleProgress,
      filteredCourses,
      selectCategory,
      selectCourse,
      backToList,
      selectLesson,
      backToCourse,
      dismissStaleProgress,
      getProgress,
      getProgressPercentage,
      debouncedSubmitExercise,
      debouncedClearExercise,
      handleInput,
      nextPage,
      prevPage,
      getReadingTime,
      isOnline,
      isLessonCompleted,
    };
  },
};
</script>

<style scoped>
/* Ensure prose styles for Markdown rendering */
.prose img {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}
.prose h1, .prose h2, .prose h3 {
  font-family: 'Crimson Pro', serif;
  color: #22252a;
}
.prose p, .prose li {
  font-family: 'Lato', sans-serif;
  color: #22252a;
}
</style>