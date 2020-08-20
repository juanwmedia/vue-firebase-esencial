import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AuthView from "../views/AuthView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
