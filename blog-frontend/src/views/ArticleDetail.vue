<template>
  <section class="max-w-4xl mx-auto px-4 py-16">
    <div v-if="loading" class="text-center text-wprimary">Chargement...</div>

    <div v-else-if="error" class="text-center text-red-500">
      Erreur : {{ error.message }}
    </div>

    <article
      v-else
      class="bg-whitebg dark:bg-bprimary p-8 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700"
    >
      <!-- Image de l'article -->
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-6"
      />

      <!-- Actions admin -->
      <div v-if="canDeletePost" class="mt-6 text-right">
        <button
          @click="handleDelete"
          class="px-4 py-2 mb-4 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
        >
          Supprimer l'article
        </button>
      </div>

      <!-- En-tête de l'article -->
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-wprimary dark:text-wtext mb-4">
          {{ post.title }}
        </h1>

        <div class="text-sm text-gray-600 dark:text-wtext">
          Catégorie :
          <span class="font-semibold">{{
            post.category?.name || "Non spécifiée"
          }}</span>
          — Auteur :
          <span class="italic">{{ post.author?.name || "Anonyme" }}</span>
        </div>
      </header>

      <!-- Contenu Markdown -->
      <ArticleContent :content="post.content" />

      <!-- Section commentaires -->
      <ArticleComments :post-id="postId" :auth="auth" />
    </article>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useArticle } from "@/composables/useArticle";
import ArticleContent from "@/components/ArticleContent.vue";
import ArticleComments from "@/components/ArticleComments.vue";

// Props et état
const route = useRoute();
const postId = route.params.id;
const auth = useAuthStore();

// Logique article
const { post, loading, error, handleDelete } = useArticle(postId);

// Permissions
const canDeletePost = computed(() => {
  return (
    auth.user &&
    (auth.user.userId === post.value.author?.id || auth.user.role === "admin")
  );
});
</script>
