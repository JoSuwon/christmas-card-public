import Vue from "vue";
import VueRouter from "vue-router";
import MainView from "@/views/MainView.vue";
import OauthView from "@/views/OauthView.vue";
import PostView from "@/views/PostView.vue";
import MyPageView from "@/views/MyPageView.vue";
import WriteCardView from "@/views/WriteCardVIew.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: MainView,
  },
  {
    path: "/oauth",
    name: "Oauth",
    component: OauthView,
  },
  {
    path: "/post/:postId",
    name: "Post",
    component: PostView,
  },
  {
    path: "/write",
    name: "Write",
    component: WriteCardView,
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPageView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.name !== 'Oauth') store.commit('SET_BEFORE_FULL_PATH', to.fullPath);
  next();
});

export default router;
