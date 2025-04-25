<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import ArticlePreview from "../components/ArticlePreview.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const articles = ref([]);
const limit = 6;
const page = ref(parseInt(route.query.page) || 1);

const loadArticles = async () => {
  const offset = (page.value - 1) * limit;
  const res = await axios.post("http://localhost:4000/graphql", {
    query: `
      query ($limit: Int!, $offset: Int!) {
        posts(limit: $limit, offset: $offset) {
          id
          title
          content
          image
        }
      }
    `,
    variables: {
      limit,
      offset,
    },
  });

  articles.value = res.data.data.posts;
};

onMounted(loadArticles);
watch(page, () => {
  router.push({ path: "/articles", query: { page: page.value } });
  loadArticles();
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-20">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-wprimary dark:text-wtext mb-8">
        Tous les articles
      </h1>
      <!-- Ne pas oublier de rajouter les condition d'être sois admin sois auteur -->
      <a
        v-if="auth.isLoggedIn"
        href="/nouvel-article"
        class="p-4 bg-wprimary text-white font-semibold px-3 py-2 rounded dark:bg-white dark:text-black cursor-pointer"
        >Créer un article</a
      >
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
      <ArticlePreview
        v-for="article in articles"
        :key="article.id"
        :title="article.title"
        :image="article.image"
        :excerpt="article.content.slice(0, 100) + '...'"
        :link="`/articles/${article.id}`"
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center space-x-4">
      <button
        @click="page > 1 && page--"
        :disabled="page <= 1"
        class="bg-wprimary dark:bg-bprimary text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Précédent
      </button>
      <button
        @click="page++"
        class="bg-wprimary dark:bg-bprimary text-white px-4 py-2 rounded"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
