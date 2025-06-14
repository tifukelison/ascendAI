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
import Contact from './components/Contact.vue';
import AboutUs from './components/AboutUs.vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/onboarding', component: OnBoarding },
  { path: '/signup', name: 'Signup', component: SignUp },
  { path: '/signin', component: SignIn },
  { path: '/contact', component: Contact },
  {path: '/about', component: AboutUs },
  { path: '/dashboard', component: DashBoard, meta: {requiresAuth: true},
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

  // Wait for Firebase to confirm the user's authentication state
  const checkAuthState = new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe from the listener after getting the state
      resolve(user);
    });
  });

  const user = await checkAuthState;

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