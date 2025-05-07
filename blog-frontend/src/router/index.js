import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import AllArticles from "../views/AllArticles.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import LoginRegister from "../views/LoginRegister.vue";
import AddArticle from "../views/AddArticle.vue";
import Profil from "../views/Profil.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/articles",
    name: "AllArticles",
    component: AllArticles,
  },
  {
    path: "/articles/:id",
    name: "ArticleDetail",
    component: ArticleDetail,
    props: true,
  },
  {
    path: "/login",
    name: "LoginRegister",
    component: LoginRegister,
  },
  {
    path: "/nouvel-article",
    name: "NewArticle",
    component: AddArticle,
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
    beforeEnter: () => {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) {
        return "/login";
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
