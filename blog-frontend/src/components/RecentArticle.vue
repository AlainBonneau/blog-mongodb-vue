<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ArticlePreview from "./ArticlePreview.vue";

const articles = ref([]);

onMounted(async () => {
  try {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `
      query {
  posts(limit: 3) {
    id
    title
    content
  }
}
`,
    });

    console.log("Réponse GraphQL :", response.data); // 🔍 Ici
    articles.value = response.data.data.posts;
  } catch (error) {
    console.error("Erreur lors du chargement des articles :", error);
  }
});
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-wprimary dark:text-wtext mb-8">Articles récents</h2>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ArticlePreview
        v-for="(article, index) in articles"
        :key="article.id"
        :title="article.title"
        :excerpt="article.content.slice(0, 100) + '...'"
        :link="`/articles/${article.id}`"
      />
    </div>
  </section>
</template>
