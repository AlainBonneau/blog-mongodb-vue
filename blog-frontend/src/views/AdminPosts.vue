<template>
  <section class="mt-8 max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Gestion des articles</h1>

    <!-- Liste des articles -->
    <ul v-if="!loading">
      <li
        v-for="post in posts"
        :key="post.id"
        class="mb-2 flex justify-between items-center border-b pb-2"
      >
        <div>
          <strong>{{ post.title }}</strong>
          <p class="text-sm text-gray-600">
            Auteur : {{ post.author?.name || "Inconnu" }} | Catégorie :
            {{ post.category?.name || "Aucune" }}
          </p>
        </div>
        <button
          @click="removePost(post.id)"
          class="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
        >
          Supprimer
        </button>
      </li>
    </ul>
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error.message }}</p>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

// Query pour récupérer tous les articles
const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts(limit: 100) {
      id
      title
      author {
        name
      }
      category {
        name
      }
    }
  }
`;

const { result, loading, error, refetch } = useQuery(GET_ALL_POSTS);
const posts = computed(() => result.value?.posts || []);

// Mutation pour supprimer un article
const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const { mutate: deletePostMutation } = useMutation(DELETE_POST);

function removePost(postId) {
  if (confirm("Confirmer la suppression de l'article ?")) {
    deletePostMutation({ postId }).then(() => {
      refetch();
    });
  }
}
</script>
