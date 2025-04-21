import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AllArticles from "../views/AllArticles.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import LoginRegister from "../views/LoginRegister.vue";
import AddArticle from "../views/AddArticle.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
