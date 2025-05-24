import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import LandingPage from './components/LandingPage.vue';
import SignUp from './components/SignUp.vue';
import OnBoarding from './components/OnBoarding.vue';
import DashBoard from './components/DashBoard.vue';
import SignIn from './components/SignIn.vue';
import Courses from './components/Courses.vue';
import Jobs from './components/Jobs.vue';
import Challenges from './components/Challenges.vue';
import Leaderboard from './components/Leaderboard.vue';
import Events from './components/Events.vue';
import Resources from './components/Resources.vue';
import Analytics from './components/Analytics.vue';
import Admin from './components/Admin.vue';
import DashboardHome from './components/DashboardHome.vue';
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
    { path: 'leaderboard', component: Leaderboard },
    { path: 'events', component: Events },
    { path: 'resources', component: Resources },
    { path: '', name: 'DashboardHome', component: DashboardHome},
    { path: 'analytics', component: Analytics }
  ]},
  {path: '/admin', component: Admin}
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      // Redirect to sign-in if not authenticated
      return next('/signin');
    }

    // Check if onboarding is complete
    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && !userDoc.data().onboardingComplete) {
      // Redirect to onboarding if not complete
      return next('/onboarding');
    }
  }

  // Allow navigation
  next();
});

export default router;