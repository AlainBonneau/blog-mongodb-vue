<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const article = ref(null);

onMounted(async () => {
  try {
    const response = await axios.post("http://localhost:4000/graphql", {
      query: `
    query ($id: ID!) {
      post(id: $id) {
        id
        title
        content
      }
    }
  `,
      variables: {
        id: route.params.id,
      },
    });

    article.value = response.data.data.post;
  } catch (error) {
    console.error("Erreur lors du chargement de l'article :", error);
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-20">
    <div v-if="article">
      <h1 class="text-4xl font-bold text-blue-900 mb-6">{{ article.title }}</h1>
      <p class="text-gray-800 leading-relaxed whitespace-pre-line">
        {{ article.content }}
      </p>
    </div>
    <div v-else class="text-center text-gray-600">
      Chargement de l'article...
    </div>
  </div>
</template>
