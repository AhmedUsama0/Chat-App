import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

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
      if (store.state.authenticated === true) {
        next({ name: "chat" });
      } else {
        next();
      }
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
      if (store.state.authenticated === false) {
        next({ name: "LogInView" });
      } else {
        next();
      }
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
