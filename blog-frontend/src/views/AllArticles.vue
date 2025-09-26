<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "../lib/axios";
import ArticlePreview from "../components/ArticlePreview.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const articles = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const searchTerm = ref("");

const limit = 6;
const page = ref(parseInt(route.query.page) || 1);

// Charger les catégories
const loadCategories = async () => {
  const res = await apiClient.post("/graphql", {
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

// Charger les articles selon le contexte (filtre, recherche, pagination)
const loadArticles = async () => {
  const offset = (page.value - 1) * limit;

  let query;
  let variables;

  if (searchTerm.value.trim()) {
    query = `
      query ($keyword: String!) {
        searchPosts(keyword: $keyword) {
          id
          title
          content
          image
        }
      }
    `;
    variables = { keyword: searchTerm.value.trim() };
  } else if (selectedCategory.value) {
    query = `
      query ($categoryId: ID!) {
        postsByCategory(categoryId: $categoryId) {
          id
          title
          content
          image
        }
      }
    `;
    variables = { categoryId: selectedCategory.value };
  } else {
    query = `
      query ($limit: Int!, $offset: Int!) {
        posts(limit: $limit, offset: $offset) {
          id
          title
          content
          image
        }
      }
    `;
    variables = { limit, offset };
  }

  const res = await apiClient.post("/graphql", {
    query,
    variables,
  });
  articles.value =
    res.data.data.posts ||
    res.data.data.postsByCategory ||
    res.data.data.searchPosts ||
    [];
};

// Sélectionner une catégorie
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  searchTerm.value = "";
  page.value = 1;
  loadArticles();
};

// Réinitialiser le filtre
const resetFilter = () => {
  selectedCategory.value = null;
  searchTerm.value = "";
  page.value = 1;
  loadArticles();
};

// Effectuer une recherche
const searchArticles = () => {
  selectedCategory.value = null;
  page.value = 1;
  loadArticles();
};

// Suivre les changements de page
watch(page, () => {
  router.push({ path: "/articles", query: { page: page.value } });
  loadArticles();
});

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

    <!-- Champ de recherche -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Rechercher un article..."
        class="border px-3 py-2 rounded flex-1 dark:bg-bprimary dark:text-wtext dark:border-wtext"
      />
      <button
        @click="searchArticles"
        class="bg-wprimary text-white font-semibold px-4 py-2 rounded dark:bg-white dark:text-black cursor-pointer"
      >
        Rechercher
      </button>
    </div>

    <!-- Filtres Catégories -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        @click="resetFilter"
        class="px-3 py-1 rounded border border-wprimary text-wprimary dark:text-wtext dark:border-wtext hover:bg-wprimary hover:text-white transition cursor-pointer"
      >
        Toutes les catégories
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="px-3 py-1 rounded border border-wprimary text-wprimary dark:text-wtext dark:border-wtext hover:bg-wprimary hover:text-white transition cursor-pointer"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Nombre d'article trouvé-->
    <div v-if="searchTerm">
      <div
        v-if="articles.length"
        class="text-center text-gray-500 mb-6 dark:text-white"
      >
        {{ articles.length }} article(s) trouvé(s)
        <span v-if="selectedCategory">
          dans la catégorie "{{
            categories.find((cat) => cat.id === selectedCategory)?.name
          }}"
        </span>
      </div>
      <div v-else class="text-center text-gray-500 mb-6 dark:text-white">
        Aucun article trouvé
        <span v-if="selectedCategory">
          dans la catégorie "{{
            categories.find((cat) => cat.id === selectedCategory)?.name
          }}"
        </span>
      </div>
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
        class="bg-wprimary dark:bg-bprimary text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
      >
        Précédent
      </button>
      <button
        @click="page++"
        class="bg-wprimary dark:bg-bprimary text-white px-4 py-2 rounded cursor-pointer"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
