import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import SignUp from './components/SignUp.vue';
import OnBoarding from './components/OnBoarding.vue';
import DashBoard from './components/DashBoard.vue';
import SignIn from './components/SignIn.vue';
import Courses from './components/Courses.vue';
import Jobs from './components/Jobs.vue';
import Challenges from './components/Challenges.vue';
import Community from './components/Community.vue';
import Events from './components/Events.vue';
import Resources from './components/Resources.vue';
import Analytics from './components/Analytics.vue';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/onboarding', component: OnBoarding },
  { path: '/signup', name: 'Signup', component: SignUp },
  { path: '/signin', component: SignIn },
  { path: '/dashboard', component: DashBoard,
  children: [
    { path: 'course', component: Courses },
    { path: 'jobs', component: Jobs },
    { path: 'challenges', component: Challenges },
    { path: 'community', component: Community },
    { path: 'events', component: Events },
    { path: 'resources', component: Resources },

    { path: 'analytics', component: Analytics }
  ]},
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;