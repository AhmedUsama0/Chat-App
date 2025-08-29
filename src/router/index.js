import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/firebase/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "LogInView",
    },
  },
  {
    path: "/login",
    name: "LogInView",
    component: () => import("@/views/LogInView.vue"),
    beforeEnter: (to, from, next) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          next({ name: "chat" });
        } else {
          next();
        }
      });
    },
  },

  {
    path: "/register",
    name: "RegisterView",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    beforeEnter: (to, from, next) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          next();
        } else {
          next({ name: "LogInView" });
        }
      });
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ChatView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
