import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import AllArticles from "../views/AllArticles.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import LoginRegister from "../views/LoginRegister.vue";
import AddArticle from "../views/AddArticle.vue";
import Profil from "../views/Profil.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Admin from "../views/Admin.vue";
import AdminUsers from "../views/AdminUsers.vue";
import AdminCategories from "../views/AdminCategories.vue";
import AdminPosts from "../views/AdminPosts.vue";
import AdminComments from "../views/AdminComments.vue";

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
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
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
  {
    path: "/admin",
    name: "AdminDashboard",
    component: Admin,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    component: AdminUsers,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/categories",
    name: "AdminCategories",
    component: AdminCategories,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/posts",
    name: "AdminPosts",
    component: AdminPosts,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/comments",
    name: "AdminComments",
    component: AdminComments,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const userRole = auth.user?.role;

  if (to.meta.requiresAdmin && userRole !== "admin") {
    return next("/");
  }

  next();
});

export default router;
