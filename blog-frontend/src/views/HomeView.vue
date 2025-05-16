<template>
  <div class="max-w-7xl mx-auto mt-10 px-4 space-y-16">
    <!-- Bandeau de bienvenue -->
    <section
      class="text-center p-10 rounded-2xl bg-wprimary dark:bg-bprimary text-white shadow-lg"
    >
      <h2 class="text-4xl font-serif font-bold mb-4">Bienvenue sur AltTab</h2>
      <p class="text-lg mb-6">
        Un espace d’échange et de partage autour du développement web, des jeux
        vidéo, des films, des séries et des animés.
      </p>
      <router-link
        to="/articles"
        class="bg-white text-wprimary dark:text-black px-6 py-2 rounded font-semibold shadow hover:bg-opacity-90 transition"
      >
        Voir tous les articles
      </router-link>
    </section>

    <!-- Articles récents -->
    <section>
      <h2
        class="text-3xl font-serif font-bold mb-8 text-wprimary dark:text-wtext"
      >
        📰 Articles récents
      </h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ArticlePreview
          v-for="article in articles"
          :key="article.id"
          :title="article.title"
          :image="article.image"
          :excerpt="article.content.slice(0, 100) + '...'"
          :link="`/articles/${article.id}`"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "../lib/axios";
import ArticlePreview from "../components/ArticlePreview.vue";

const articles = ref([]);

onMounted(async () => {
  const res = await apiClient.post("/graphql", {
    query: `
      query {
        posts(limit: 6) {
          id
          title
          content
          image
        }
      }
    `,
  });
  articles.value = res.data.data.posts;
});
</script>
