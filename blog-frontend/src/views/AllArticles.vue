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
const categories = ref([]);
const selectedCategory = ref(null);

const limit = 6;
const page = ref(parseInt(route.query.page) || 1);

// Charger les catégories
const loadCategories = async () => {
  const res = await axios.post("http://localhost:4000/graphql", {
    query: `
      query {
        categories {
          id
          name
        }
      }
    `,
  });
  categories.value = res.data.data.categories;
};

// Charger les articles (filtré ou non)
const loadArticles = async () => {
  const offset = (page.value - 1) * limit;
  const isFiltering = !!selectedCategory.value;

  const query = isFiltering
    ? `
      query ($categoryId: ID!) {
        postsByCategory(categoryId: $categoryId) {
          id
          title
          content
          image
        }
      }
    `
    : `
      query ($limit: Int!, $offset: Int!) {
        posts(limit: $limit, offset: $offset) {
          id
          title
          content
          image
        }
      }
    `;

  const variables = isFiltering
    ? { categoryId: selectedCategory.value }
    : { limit, offset };

  const res = await axios.post("http://localhost:4000/graphql", {
    query,
    variables,
  });

  articles.value = isFiltering
    ? res.data.data.postsByCategory
    : res.data.data.posts;
};

// Réagir aux changements de page
watch(page, () => {
  router.push({ path: "/articles", query: { page: page.value } });
  loadArticles();
});

// Sélectionner une catégorie
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  page.value = 1;
  loadArticles();
};

// Réinitialiser les filtres
const resetFilter = () => {
  selectedCategory.value = null;
  page.value = 1;
  loadArticles();
};

// Initialisation
onMounted(() => {
  loadCategories();
  loadArticles();
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-20">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-wprimary dark:text-wtext mb-8">
        Tous les articles
      </h1>
      <a
        v-if="auth.isLoggedIn"
        href="/nouvel-article"
        class="p-4 bg-wprimary text-white font-semibold px-3 py-2 rounded dark:bg-white dark:text-black cursor-pointer"
        >Créer un article</a
      >
    </div>

    <!-- Filtres Catégories -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        @click="resetFilter"
        class="px-3 py-1 rounded border border-wprimary text-wprimary dark:text-wtext dark:border-wtext hover:bg-wprimary hover:text-white transition"
      >
        Toutes les catégories
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="px-3 py-1 rounded border border-wprimary text-wprimary dark:text-wtext dark:border-wtext hover:bg-wprimary hover:text-white transition"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Liste des articles -->
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
