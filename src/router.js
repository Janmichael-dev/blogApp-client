// Vue Router setup
import { createRouter, createWebHistory } from "vue-router";

// Import pages (views)
import Home from "./views/Home.vue";
import ScriptDetail from "./views/ScriptDetail.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import ScriptNew from "./views/ScriptNew.vue";
import ScriptEdit from "./views/ScriptEdit.vue";
import MyScripts from "./views/MyScripts.vue";

// Define application routes
const routes = [
  { 
    path: "/", 
    component: Home 
  },
  { 
    path: "/my-scripts", 
    component: MyScripts,
    meta: { requiresAuth: true } // Protect this page
  },
  { 
    path: "/scripts/new", 
    component: ScriptNew, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/scripts/:id", 
    component: ScriptDetail
  },
  { 
    path: "/scripts/:id/edit", 
    component: ScriptEdit, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/login", 
    component: Login 
  },
  { 
    path: "/register", 
    component: Register 
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to anchor (for comments section)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    // Return to saved position when using back button
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise scroll to top
    return { top: 0 };
  },
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = !!localStorage.getItem("token");
  
  if (requiresAuth && !isLoggedIn) {
    alert("Please log in to access this page");
    next("/login");
  } else {
    next();
  }
});

export default router;