import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/chat",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/AdminPanel.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("bearerToken");
    if (!token) {
      next({ name: "Login" });
      return;
    }

    // Admin guard
    if (to.meta.requiresAdmin) {
      const { default: useUserStore } = await import("../stores/user");
      const userStore = useUserStore();
      // If user data is not loaded yet, fetch it
      if (!userStore.user.id) {
        await userStore.getUser();
      }
      if (!userStore.user.isAdmin) {
        next({ name: "Dashboard" });
        return;
      }
    }

    next();
  } else {
    next();
  }
});

export default router;
