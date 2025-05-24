<template>
  <div class="container mx-auto p-4">
    <h1 class="font-crimson text-3xl text-dark mb-6">Admin: Manage Courses & Lessons</h1>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 p-4 mb-4 rounded font-lato text-red-500">
      {{ error }}
      <button @click="error = null" class="underline text-primary ml-2">Dismiss</button>
    </div>

    <!-- Create Course Form -->
    <div class="mb-8 border rounded-lg p-4 shadow-sm">
      <h2 class="font-crimson text-2xl text-dark mb-4">{{ editingCourse ? 'Edit Course' : 'Create a New Course' }}</h2>
      <form @submit.prevent="editingCourse ? updateCourse() : createCourse()">
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Course Title</label>
          <input
            v-model="newCourse.title"
            type="text"
            required
            class="w-full p-2 border rounded font-lato text-dark"
            placeholder="e.g., How to get your first client"
          />
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Category</label>
          <select
            v-model="newCourse.category"
            required
            class="w-full p-2 border rounded font-lato text-dark"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Description</label>
          <textarea
            v-model="newCourse.description"
            required
            class="w-full p-2 border rounded font-lato text-dark resize-y"
            placeholder="A brief summary of the course"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Total XP</label>
          <input
            v-model.number="newCourse.xpTotal"
            type="number"
            min="0"
            required
            class="w-full p-2 border rounded font-lato text-dark"
            placeholder="e.g., 20"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="loadingCourse"
            class="bg-primary text-white font-lato py-2 px-4 rounded flex items-center transition-colors duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': loadingCourse }"
          >
            <span v-if="loadingCourse" class="mr-2">
              <div class="border-t-2 border-white rounded-full animate-spin w-4 h-4"></div>
            </span>
            {{ editingCourse ? 'Update Course' : 'Create Course' }}
          </button>
          <button
            v-if="editingCourse"
            @click="cancelEditCourse"
            type="button"
            class="bg-gray-200 text-dark font-lato py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Create Lesson Form -->
    <div class="mb-8 border rounded-lg p-4 shadow-sm">
      <h2 class="font-crimson text-2xl text-dark mb-4">{{ editingLesson ? 'Edit Lesson' : 'Create a New Lesson' }}</h2>
      <form @submit.prevent="editingLesson ? updateLesson() : createLesson()">
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Select Course</label>
          <select
            v-model="newLesson.courseId"
            required
            class="w-full p-2 border rounded font-lato text-dark"
            @change="fetchLessonsForCourse"
            :disabled="editingLesson"
          >
            <option value="" disabled>Select a course</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Lesson Title</label>
          <input
            v-model="newLesson.title"
            type="text"
            required
            class="w-full p-2 border rounded font-lato text-dark"
            placeholder="e.g., Lesson 1"
          />
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">Content</label>
          <textarea
            v-model="newLesson.content"
            required
            class="w-full p-2 border rounded font-lato text-dark resize-y"
            placeholder="Lesson content..."
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="font-lato text-dark block mb-1">XP Reward</label>
          <input
            v-model.number="newLesson.xpReward"
            type="number"
            min="0"
            required
            class="w-full p-2 border rounded font-lato text-dark"
            placeholder="e.g., 10"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="loadingLesson || !newLesson.courseId"
            class="bg-primary text-white font-lato py-2 px-4 rounded flex items-center transition-colors duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': loadingLesson || !newLesson.courseId }"
          >
            <span v-if="loadingLesson" class="mr-2">
              <div class="border-t-2 border-white rounded-full animate-spin w-4 h-4"></div>
            </span>
            {{ editingLesson ? 'Update Lesson' : 'Create Lesson' }}
          </button>
          <button
            v-if="editingLesson"
            @click="cancelEditLesson"
            type="button"
            class="bg-gray-200 text-dark font-lato py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Course List with Lessons -->
    <div v-if="loadingCourses" class="flex justify-center items-center h-64">
      <div class="border-t-4 border-primary rounded-full animate-spin w-8 h-8"></div>
    </div>
    <div v-else-if="courses.length === 0" class="font-lato text-dark">
      No courses available. Create a course to get started.
    </div>
    <div v-else>
      <div
        v-for="course in courses"
        :key="course.id"
        class="border rounded-lg p-4 mb-4 shadow-sm"
      >
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-crimson text-xl text-dark">{{ course.title }}</h2>
          <div class="flex gap-2">
            <button
              @click="editCourse(course)"
              class="bg-primary text-white font-lato py-1 px-3 rounded hover:bg-opacity-90 transition-colors duration-200"
            >
              Edit
            </button>
            <button
              @click="deleteCourse(course.id)"
              class="bg-red-500 text-white font-lato py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
        <p class="font-lato text-dark mb-2">{{ course.description }}</p>
        <p class="font-lato text-dark mb-2">Category: {{ course.category }}</p>
        <p class="font-lato text-dark mb-2">Total XP: {{ course.xpTotal }}</p>
        <h3 class="font-crimson text-lg text-dark mb-2">Lessons</h3>
        <div v-if="courseLessons[course.id]?.loading" class="flex items-center">
          <div class="border-t-2 border-primary rounded-full animate-spin w-4 h-4 mr-2"></div>
          Loading lessons...
        </div>
        <div v-else-if="!courseLessons[course.id]?.lessons?.length" class="font-lato text-dark">
          No lessons yet. Add a lesson to this course.
        </div>
        <ul v-else class="font-lato text-dark list-disc pl-5">
          <li v-for="lesson in courseLessons[course.id].lessons" :key="lesson.id" class="flex justify-between items-center">
            <span>{{ lesson.title }} (XP: {{ lesson.xpReward }})</span>
            <div class="flex gap-2">
              <button
                @click="editLesson(course.id, lesson)"
                class="text-primary font-lato underline hover:text-opacity-80 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                @click="deleteLesson(course.id, lesson.id)"
                class="text-red-500 font-lato underline hover:text-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, query, orderBy, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path to your Firebase config
import { auth } from '../firebase'; // Adjust the import path to your Firebase config

export default {
  name: 'Admin',
  setup() {
    // State variables
    const categories = ref(['Branding', 'Design', 'Marketing', 'Development', 'Business', 'Lifestyle', 'Copy & Content']);
    const courses = ref([]);
    const courseLessons = ref({}); // Stores lessons for each course
    const loadingCourses = ref(true);
    const loadingCourse = ref(false);
    const loadingLesson = ref(false);
    const error = ref(null);
    const editingCourse = ref(null);
    const editingLesson = ref(null);

    // Form data for new/edited course
    const newCourse = ref({
      title: '',
      category: categories.value[0],
      description: '',
      xpTotal: 0,
      version: 1,
      lessons: [],
    });

    // Form data for new/edited lesson
    const newLesson = ref({
      courseId: '',
      title: '',
      content: '',
      xpReward: 0,
      type: 'text', // Default type
    });

    // Fetch all courses
    const fetchCourses = async () => {
      loadingCourses.value = true;
      try {
        const q = query(collection(db, 'courses'), orderBy('title'));
        const querySnapshot = await getDocs(q);
        courses.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Initialize lessons for each course
        courses.value.forEach((course) => {
          courseLessons.value[course.id] = { lessons: [], loading: false };
        });
      } catch (err) {
        error.value = `Failed to load courses: ${err.message}`;
      } finally {
        loadingCourses.value = false;
      }
    };

    // Fetch lessons for a specific course
    const fetchLessonsForCourse = async (courseId) => {
      if (!courseId || courseLessons.value[courseId]?.lessons?.length) return;
      courseLessons.value[courseId] = { lessons: [], loading: true };
      try {
        const courseDoc = courses.value.find((c) => c.id === courseId);
        const lessonIds = courseDoc?.lessons || [];
        const lessonDocs = await Promise.all(
          lessonIds.map((lessonId) =>
            getDoc(doc(db, 'lessons', lessonId)).then((doc) => ({ id: doc.id, ...doc.data() }))
          )
        );
        courseLessons.value[courseId].lessons = lessonDocs;
      } catch (err) {
        error.value = `Failed to load lessons for course ${courseId}: ${err.message}`;
      } finally {
        courseLessons.value[courseId].loading = false;
      }
    };

    // Create a new course
    const createCourse = async () => {
      if (!auth.currentUser) {
        error.value = 'You must be signed in to create a course.';
        return;
      }
      loadingCourse.value = true;
      error.value = null;
      try {
        const courseId = `course_${Date.now()}`; // Simple ID generation
        const courseData = {
          ...newCourse.value,
          lessons: [], // Initialize with empty lessons array
        };
        await setDoc(doc(db, 'courses', courseId), courseData);
        courses.value.push({ id: courseId, ...courseData });
        courseLessons.value[courseId] = { lessons: [], loading: false };
        // Reset form
        resetCourseForm();
      } catch (err) {
        error.value = `Failed to create course: ${err.message}`;
      } finally {
        loadingCourse.value = false;
      }
    };

    // Edit a course
    const editCourse = (course) => {
      editingCourse.value = course.id;
      newCourse.value = { ...course };
    };

    // Update a course
    const updateCourse = async () => {
      if (!auth.currentUser) {
        error.value = 'You must be signed in to update a course.';
        return;
      }
      loadingCourse.value = true;
      error.value = null;
      try {
        const courseRef = doc(db, 'courses', editingCourse.value);
        await updateDoc(courseRef, {
          title: newCourse.value.title,
          category: newCourse.value.category,
          description: newCourse.value.description,
          xpTotal: newCourse.value.xpTotal,
          version: newCourse.value.version + 1, // Increment version
        });
        const courseIndex = courses.value.findIndex((c) => c.id === editingCourse.value);
        courses.value[courseIndex] = { ...courses.value[courseIndex], ...newCourse.value, version: newCourse.value.version + 1 };
        resetCourseForm();
      } catch (err) {
        error.value = `Failed to update course: ${err.message}`;
      } finally {
        loadingCourse.value = false;
      }
    };

    // Cancel editing a course
    const cancelEditCourse = () => {
      resetCourseForm();
    };

    // Reset course form
    const resetCourseForm = () => {
      editingCourse.value = null;
      newCourse.value = {
        title: '',
        category: categories.value[0],
        description: '',
        xpTotal: 0,
        version: 1,
        lessons: [],
      };
    };

    // Delete a course
    const deleteCourse = async (courseId) => {
      if (!confirm('Are you sure you want to delete this course and all its lessons?')) return;
      loadingCourse.value = true;
      error.value = null;
      try {
        // Delete all lessons associated with the course
        const lessonIds = courses.value.find((c) => c.id === courseId).lessons || [];
        await Promise.all(
          lessonIds.map((lessonId) => deleteDoc(doc(db, 'lessons', lessonId)))
        );
        // Delete the course
        await deleteDoc(doc(db, 'courses', courseId));
        courses.value = courses.value.filter((c) => c.id !== courseId);
        delete courseLessons.value[courseId];
      } catch (err) {
        error.value = `Failed to delete course: ${err.message}`;
      } finally {
        loadingCourse.value = false;
      }
    };

    // Create a new lesson and update course reference
    const createLesson = async () => {
      if (!auth.currentUser) {
        error.value = 'You must be signed in to create a lesson.';
        return;
      }
      if (!newLesson.value.courseId) {
        error.value = 'Please select a course for the lesson.';
        return;
      }
      loadingLesson.value = true;
      error.value = null;
      try {
        const lessonId = `lesson_${Date.now()}`; // Simple ID generation
        const lessonData = {
          ...newLesson.value,
          courseId: newLesson.value.courseId,
        };
        // Create lesson document
        await setDoc(doc(db, 'lessons', lessonId), lessonData);
        // Update course with lesson reference
        const courseRef = doc(db, 'courses', newLesson.value.courseId);
        await updateDoc(courseRef, {
          lessons: arrayUnion(lessonId),
        });
        // Update local state
        const courseIndex = courses.value.findIndex((c) => c.id === newLesson.value.courseId);
        courses.value[courseIndex].lessons.push(lessonId);
        if (courseLessons.value[newLesson.value.courseId]) {
          courseLessons.value[newLesson.value.courseId].lessons.push({ id: lessonId, ...lessonData });
        }
        // Reset form
        resetLessonForm();
      } catch (err) {
        error.value = `Failed to create lesson: ${err.message}`;
      } finally {
        loadingLesson.value = false;
      }
    };

    // Edit a lesson
    const editLesson = (courseId, lesson) => {
      editingLesson.value = lesson.id;
      newLesson.value = { ...lesson, courseId };
    };

    // Update a lesson
    const updateLesson = async () => {
      if (!auth.currentUser) {
        error.value = 'You must be signed in to update a lesson.';
        return;
      }
      loadingLesson.value = true;
      error.value = null;
      try {
        const lessonRef = doc(db, 'lessons', editingLesson.value);
        await updateDoc(lessonRef, {
          title: newLesson.value.title,
          content: newLesson.value.content,
          xpReward: newLesson.value.xpReward,
          type: newLesson.value.type,
        });
        // Update local state
        const lessons = courseLessons.value[newLesson.value.courseId].lessons;
        const lessonIndex = lessons.findIndex((l) => l.id === editingLesson.value);
        lessons[lessonIndex] = { ...lessons[lessonIndex], ...newLesson.value };
        resetLessonForm();
      } catch (err) {
        error.value = `Failed to update lesson: ${err.message}`;
      } finally {
        loadingLesson.value = false;
      }
    };

    // Cancel editing a lesson
    const cancelEditLesson = () => {
      resetLessonForm();
    };

    // Reset lesson form
    const resetLessonForm = () => {
      editingLesson.value = null;
      newLesson.value = {
        courseId: '',
        title: '',
        content: '',
        xpReward: 0,
        type: 'text',
      };
    };

    // Delete a lesson
    const deleteLesson = async (courseId, lessonId) => {
      if (!confirm('Are you sure you want to delete this lesson?')) return;
      loadingLesson.value = true;
      error.value = null;
      try {
        // Delete lesson document
        await deleteDoc(doc(db, 'lessons', lessonId));
        // Remove lesson from course
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, {
          lessons: arrayRemove(lessonId),
        });
        // Update local state
        const courseIndex = courses.value.findIndex((c) => c.id === courseId);
        courses.value[courseIndex].lessons = courses.value[courseIndex].lessons.filter((id) => id !== lessonId);
        courseLessons.value[courseId].lessons = courseLessons.value[courseId].lessons.filter((l) => l.id !== lessonId);
      } catch (err) {
        error.value = `Failed to delete lesson: ${err.message}`;
      } finally {
        loadingLesson.value = false;
      }
    };

    // Fetch courses on mount
    onMounted(fetchCourses);

    return {
      categories,
      courses,
      courseLessons,
      loadingCourses,
      loadingCourse,
      loadingLesson,
      error,
      newCourse,
      newLesson,
      editingCourse,
      editingLesson,
      createCourse,
      editCourse,
      updateCourse,
      cancelEditCourse,
      deleteCourse,
      createLesson,
      editLesson,
      updateLesson,
      cancelEditLesson,
      deleteLesson,
      fetchLessonsForCourse,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>