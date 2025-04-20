<template>
  <section class="max-w-4xl mx-auto px-4 py-16">
    <div v-if="loading" class="text-center text-wprimary">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur : {{ error.message }}
    </div>

    <article v-else class="bg-whitebg dark:bg-blackbg p-8 rounded-xl shadow-md">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 class="text-3xl font-bold text-wprimary dark:text-wtext mb-2">
        {{ post.title }}
      </h1>

      <div class="text-sm text-gray-600 dark:text-wtext mb-4">
        Catégorie :
        <span class="font-semibold">{{
          post.category?.name || "Non spécifiée"
        }}</span>
        - Auteur :
        <span class="italic">{{ post.author?.name || "Anonyme" }}</span>
      </div>

      <div
        class="text-gray-800 dark:text-wtext leading-relaxed whitespace-pre-line"
      >
        {{ post.content }}
      </div>
    </article>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import gql from "graphql-tag";

const route = useRoute();
const postId = route.params.id;

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      image
      category {
        name
      }
      author {
        name
      }
    }
  }
`;

const { result, loading, error } = useQuery(GET_POST, { id: postId });
const post = computed(() => result.value?.post || {});
</script>
