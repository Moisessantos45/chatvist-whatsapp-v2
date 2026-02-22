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
    // meta: {
    //   requiresAuth: true,
    // },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach((to, _, next) => {
//   if (to.meta.requiresAuth) {
//     next({ name: "Login" });
//   } else {
//     next();
//   }
// });

export default router;
