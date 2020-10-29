import Vue from "vue";
import VueRouter from "vue-router";
const RoomsView = () => import("../views/RoomsView.vue");
const AuthView = () => import("../views/AuthView.vue");
const UserProfileView = () => import("../views/UserProfileView.vue");
const CreateRoom = () => import("../views/CreateRoom.vue");
const UpdateRoom = () => import("../views/UpdateRoom.vue");
const ViewRoom = () => import("../views/ViewRoom.vue");
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: RoomsView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/auth",
    name: "auth",
    component: AuthView
  },
  {
    path: "/profile",
    name: "profile",
    component: UserProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/create",
    name: "create",
    component: CreateRoom,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/update/:id",
    name: "update",
    props: true,
    component: UpdateRoom,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/view/:id",
    name: "view",
    props: true,
    component: ViewRoom,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Requires auth & no user
  if (requiresAuth && !(await store.dispatch("user/getCurrentUser"))) {
    next({ name: "auth" });
    // No requires auth and user (auth)
  } else if (!requiresAuth && (await store.dispatch("user/getCurrentUser"))) {
    next({ name: "Home" });
  } else {
    // Anything else
    next();
  }
});

export default router;
