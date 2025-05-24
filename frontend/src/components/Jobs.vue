<template>
  <div class="container mx-auto p-4 md:p-6 font-lato">
    <!-- User Details Loading State -->
    <div v-if="isLoadingUserDetails" class="text-center py-10">
      <p class="text-lg text-gray-600">Loading your details...</p>
      <div class="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" :style="{ borderColor: secondaryColor, borderRightColor: 'transparent' }" role="status">
        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>

    <!-- Main Content Area (User Loaded) -->
    <div v-else-if="user">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center md:text-left">
        Hey <span :style="{ color: mainColor }">{{ user.displayName || 'there' }}</span>, these are what we found for you:
      </h1>

      <!-- Job Fetching Loading State (Skeletons) -->
      <div v-if="isLoadingJobs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div v-for="n in jobsPerPage" :key="`skeleton-${n}`"
             class="bg-white shadow-lg rounded-lg p-6 animate-pulse border border-gray-200">
          <div class="flex items-center mb-3">
            <div class="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <div class="h-7 bg-gray-300 rounded w-40 mb-1"></div> <!-- Title -->
              <div class="h-5 bg-gray-300 rounded w-28"></div> <!-- Company -->
            </div>
          </div>
          <div class="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6 mb-5"></div>
          <div class="flex justify-between items-center mt-4">
            <div class="h-10 bg-gray-300 rounded w-1/3"></div>
            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- Job Cards Display -->
      <div v-else-if="currentJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div v-for="job in currentJobs" :key="job.id"
             @click="openJobModal(job)"
             class="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border border-gray-200 hover:shadow-xl hover:border-transparent transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
             :style="{ borderColor: 'rgba(45, 55, 72, 0.1)' }">
          <div>
            <div class="flex items-start mb-2">
              <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company_name + ' logo'" class="w-12 h-12 rounded-md mr-4 object-contain border border-gray-200 p-0.5">
              <div v-else class="w-12 h-12 rounded-md mr-4 bg-gray-100 flex items-center justify-center text-xl font-semibold" :style="{ color: secondaryColor }">
                {{ job.company_name ? job.company_name.charAt(0) : '?' }}
              </div>
              <div>
                <h2 class="text-lg font-crimson-pro font-semibold leading-tight" :style="{ color: secondaryColor }">
                  {{ job.title }}
                </h2>
                <p class="text-sm font-medium" :style="{ color: mainColor }">{{ job.company_name }}</p>
              </div>
            </div>

            <p class="text-xs text-gray-500 mb-2">Category: {{ job.category }}</p>
            <p v-if="job.candidate_required_location" class="text-xs text-gray-500 mb-3">
              Location: {{ job.candidate_required_location }}
            </p>

            <div class="text-sm text-gray-700 mb-3 max-h-24 overflow-hidden prose prose-sm max-w-none"
                 v-html="getShortDescription(job.description, 150)"
                 :style="{ color: secondaryColor }">
            </div>

             <div v-if="job.tags && job.tags.length" class="mb-4 mt-2">
              <span v-for="tag in job.tags.slice(0, 3)" :key="tag"
                    class="inline-block bg-gray-100 rounded-full px-2.5 py-1 text-xs font-medium mr-1.5 mb-1.5 transition-all duration-200 hover:shadow-sm"
                    :style="{ color: secondaryColor, backgroundColor: 'rgba(254, 87, 42, 0.1)' }">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="mt-auto pt-3 text-right">
            <p class="text-xs text-gray-500">Published: {{ formatDate(job.publication_date) }}</p>
            <button
              class="text-sm font-semibold mt-2 hover:underline"
              :style="{ color: mainColor }"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- No Jobs Found States -->
      <div v-else-if="!isLoadingJobs && combinedSearchTerms.length > 0" class="text-center py-10">
        <p class="text-lg mb-2" :style="{ color: secondaryColor }">Hmm, nothing found right now matching your skills/interests.</p>
        <p class="text-sm text-gray-500">Try adjusting your profile skills/interests or check back later!</p>
      </div>
      <div v-else-if="!isLoadingJobs && combinedSearchTerms.length === 0" class="text-center py-10">
        <p class="text-lg" :style="{ color: secondaryColor }">Add skills and interests to your profile to discover job recommendations!</p>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-10 flex justify-center items-center" v-if="allFetchedJobs.length > 0">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoadingPageChange"
                class="font-semibold py-2 px-4 rounded-l transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                :style="{ backgroundColor: currentPage === 1 ? '#E2E8F0' : mainColor, color: currentPage === 1 ? secondaryColor : 'white' }"
                :class="{ 'hover:opacity-80': currentPage !== 1 }">
          <span v-if="isLoadingPageChange && isChangingToPrev" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
          <span v-else>Prev</span>
        </button>
        <span class="px-5 py-2 text-gray-700 bg-gray-100" :style="{ color: secondaryColor }">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages || isLoadingPageChange"
                class="font-semibold py-2 px-4 rounded-r transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                :style="{ backgroundColor: currentPage === totalPages ? '#E2E8F0' : mainColor, color: currentPage === totalPages ? secondaryColor : 'white' }"
                :class="{ 'hover:opacity-80': currentPage !== totalPages }">
          <span v-if="isLoadingPageChange && !isChangingToPrev" class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
          <span v-else>Next</span>
        </button>
      </div>

      <!-- End of Jobs Message -->
      <div v-if="allJobsFetchedFromServer && currentPage === totalPages && !isLoadingJobs && allFetchedJobs.length > 0" class="text-center text-gray-600 mt-8 font-semibold">
        That's all for now! Check back later for new opportunities.
      </div>

      <!-- Remotive Attribution -->
      <div class="text-center mt-10 py-4 border-t border-gray-200">
        <p class="text-sm" :style="{ color: secondaryColor }">
          Job listings powered by <a href="https://remotive.com/" target="_blank" rel="noopener noreferrer" class="font-semibold hover:underline" :style="{ color: mainColor }">Remotive</a>.
        </p>
      </div>
    </div>

    <!-- Logged Out State -->
    <div v-else-if="!isLoadingUserDetails && !user" class="text-center py-10">
      <p class="text-lg" :style="{ color: secondaryColor }">Please log in to see personalized job recommendations.</p>
    </div>

    <!-- Job Details Modal -->
    <transition name="modal-fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeJobModal">
        <!-- MODIFIED HERE: Removed backdrop-blur-sm -->
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity"></div>
        
        <div class="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative z-10">
          <button @click="closeJobModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div v-if="selectedJob" class="space-y-4">
            <div class="flex items-start mb-3">
                <img v-if="selectedJob.company_logo" :src="selectedJob.company_logo" :alt="selectedJob.company_name + ' logo'" class="w-16 h-16 rounded-lg mr-4 object-contain border border-gray-200 p-1">
                 <div v-else class="w-16 h-16 rounded-lg mr-4 bg-gray-100 flex items-center justify-center text-2xl font-semibold" :style="{ color: secondaryColor }">
                    {{ selectedJob.company_name ? selectedJob.company_name.charAt(0) : '?' }}
                </div>
                <div>
                    <h2 class="text-2xl md:text-3xl font-crimson-pro font-bold leading-tight" :style="{ color: secondaryColor }">
                        {{ selectedJob.title }}
                    </h2>
                    <p class="text-lg font-medium" :style="{ color: mainColor }">{{ selectedJob.company_name }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
              <p><strong :style="{ color: secondaryColor }">Category:</strong> {{ selectedJob.category }}</p>
              <p v-if="selectedJob.candidate_required_location"><strong :style="{ color: secondaryColor }">Location:</strong> {{ selectedJob.candidate_required_location }}</p>
              <p v-if="selectedJob.job_type"><strong :style="{ color: secondaryColor }">Job Type:</strong> {{ formatJobType(selectedJob.job_type) }}</p>
              <p><strong :style="{ color: secondaryColor }">Published:</strong> {{ formatDate(selectedJob.publication_date) }}</p>
            </div>

            <div v-if="selectedJob.tags && selectedJob.tags.length" class="py-2">
              <strong class="block text-sm font-medium mb-1" :style="{ color: secondaryColor }">Tags:</strong>
              <span v-for="tag in selectedJob.tags" :key="tag"
                    class="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2"
                    :style="{ color: secondaryColor, backgroundColor: 'rgba(254, 87, 42, 0.1)' }">
                {{ tag }}
              </span>
            </div>
            
            <div class="py-2">
                <strong class="block text-sm font-medium mb-1" :style="{ color: secondaryColor }">Description:</strong>
                <div class="prose prose-sm max-w-none text-gray-700" v-html="selectedJob.description"></div>
            </div>


            <div class="pt-4 text-center">
              <a :href="selectedJob.url" target="_blank" rel="noopener noreferrer"
                 class="inline-block text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-base"
                 :style="{ backgroundColor: mainColor }">
                Apply on Remotive
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'Jobs',
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  data() {
    return {
      user: null,
      userDetails: { skills: [], interests: [] },
      isLoadingUserDetails: true,
      isLoadingJobs: false,
      isLoadingPageChange: false,
      isChangingToPrev: false,

      allFetchedJobs: [],
      currentJobs: [],
      currentPage: 1,
      jobsPerPage: 6, // Can be adjusted
      combinedSearchTerms: [],
      noMoreJobsFromServer: false,
      
      isModalOpen: false,
      selectedJob: null,

      mainColor: '#fe572a',
      secondaryColor: '#2d3748',
    };
  },
  computed: {
    totalPages() { return Math.ceil(this.allFetchedJobs.length / this.jobsPerPage); },
    auth() { return getAuth(); },
    db() { return getFirestore(); },
    allJobsFetchedFromServer() {
      return this.noMoreJobsFromServer && this.allFetchedJobs.length > 0 && this.currentPage === this.totalPages;
    }
  },
  watch: {
    combinedSearchTerms: {
      handler(newTerms, oldTerms) {
        if (JSON.stringify(newTerms) !== JSON.stringify(oldTerms) || this.allFetchedJobs.length === 0) {
          this.loadJobs();
        }
      },
      deep: true
    },
    isModalOpen(isOpen) { 
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
  },
  methods: {
    formatJobType(jobType) {
      if (!jobType) return '';
      const formatted = jobType.replace('_', ' ');
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    },
    async fetchUserDetails(firebaseUser) {
      if (!firebaseUser) {
        this.user = null;
        this.isLoadingUserDetails = false;
        return;
      }
      this.user = firebaseUser;
      try {
        const userDocRef = doc(this.db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.userDetails.skills = data.skills || [];
          this.userDetails.interests = data.interests || [];
          this.combinedSearchTerms = [...new Set([...this.userDetails.skills, ...this.userDetails.interests])];
        } else {
          console.log("No such user document!");
          this.combinedSearchTerms = [];
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        this.combinedSearchTerms = [];
      } finally {
        this.isLoadingUserDetails = false;
      }
    },
    async fetchRemotiveJobs(searchTerm, limit = 50) {
      let query = searchTerm;
      let apiUrl = `https://remotive.com/api/remote-jobs?limit=${limit}`;
      if (query) {
        apiUrl += `&search=${encodeURIComponent(query)}`;
      }
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          const relevantJobs = data.jobs.filter(job =>
            !job.candidate_required_location ||
            job.candidate_required_location.toLowerCase() === 'worldwide' ||
            job.candidate_required_location.toLowerCase().includes('africa') ||
            job.candidate_required_location.toLowerCase().includes('anywhere')
          );
          if (data.jobs.length < limit) {
            this.noMoreJobsFromServer = true;
          }
          return relevantJobs;
        } else {
          this.noMoreJobsFromServer = true;
          return [];
        }
      } catch (error) {
        console.error('Error fetching Remotive jobs:', error);
        this.noMoreJobsFromServer = true;
        return [];
      }
    },
    async loadJobs() {
      if (this.isLoadingUserDetails || this.combinedSearchTerms.length === 0) {
        if (this.combinedSearchTerms.length === 0 && !this.isLoadingUserDetails) {
            this.allFetchedJobs = [];
            this.updateCurrentJobs();
        }
        return;
      }

      this.isLoadingJobs = true;
      this.allFetchedJobs = [];
      this.currentPage = 1;
      this.noMoreJobsFromServer = false;

      const primarySearchTerm = this.combinedSearchTerms[0] || '';
      const jobs = await this.fetchRemotiveJobs(primarySearchTerm);
      this.allFetchedJobs = jobs;
      this.updateCurrentJobs();
      this.isLoadingJobs = false;
    },
    updateCurrentJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      const end = start + this.jobsPerPage;
      this.currentJobs = this.allFetchedJobs.slice(start, end);
      if(this.currentPage > 1 || (this.currentPage === 1 && this.allFetchedJobs.length > 0 && !this.isLoadingJobs)) {
        // Smooth scroll to top unless it's the very initial load with no jobs yet
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    async nextPage() { 
        if (this.currentPage < this.totalPages) {
            this.isLoadingPageChange = true;
            this.isChangingToPrev = false;
            this.currentPage++;
            this.updateCurrentJobs();
            await new Promise(resolve => setTimeout(resolve, 100)); 
            this.isLoadingPageChange = false;
        }
    },
    async prevPage() { 
        if (this.currentPage > 1) {
            this.isLoadingPageChange = true;
            this.isChangingToPrev = true;
            this.currentPage--;
            this.updateCurrentJobs();
            await new Promise(resolve => setTimeout(resolve, 100)); 
            this.isLoadingPageChange = false;
        }
    },
    getShortDescription(htmlString, maxLength) {
      if (!htmlString) return '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      let text = tempDiv.textContent || tempDiv.innerText || "";
      if (text.length > maxLength) {
        // Return a snippet of the original HTML for short descriptions
        // To avoid breaking tags, we'll just take the text content for truncation preview
        return text.substring(0, maxLength) + "...";
      }
      // If short enough, return original HTML to keep basic formatting
      return htmlString;
    },
    openJobModal(job) {
      this.selectedJob = job;
      this.isModalOpen = true;
    },
    closeJobModal() {
      this.isModalOpen = false;
      this.selectedJob = null;
    },
    formatDate(dateString) { 
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleKeydown(event) {
        if (this.isModalOpen && event.key === 'Escape') {
            this.closeJobModal();
        }
    }
  },
  mounted() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.fetchUserDetails(firebaseUser);
      } else {
        this.user = null;
        this.userDetails.skills = [];
        this.userDetails.interests = [];
        this.combinedSearchTerms = [];
        this.isLoadingUserDetails = false;
        this.allFetchedJobs = [];
        this.updateCurrentJobs();
      }
    });
    if (this.auth.currentUser) {
      this.fetchUserDetails(this.auth.currentUser);
    } else {
      this.isLoadingUserDetails = false;
    }
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
      document.body.style.overflow = ''; 
      window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style>
.font-crimson-pro { font-family: 'Crimson Pro', serif; }
.font-lato { font-family: 'Lato', sans-serif; }

/* Modal Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .transform, .modal-fade-leave-active .transform {
  transition: all 0.3s ease; /* For scale/translate */
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .transform, .modal-fade-leave-to .transform {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
/* Enter/Leave to/from states are handled by default opacity:1, scale:1, translateY:0 */

/* Tailwind Prose customisations */
.prose a { color: #fe572a; text-decoration: none; }
.prose a:hover { text-decoration: underline; }
.prose-sm ul, .prose-sm ol { margin-left: 1.25em; }
.prose-sm li p { margin-bottom: 0.25em; }
</style>