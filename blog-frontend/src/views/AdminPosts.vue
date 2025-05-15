<template>
  <section
    class="max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1 class="text-3xl font-serif font-bold mb-6 text-whitebg dark:text-wtext">
      Gestion des articles
    </h1>

    <ul v-if="!loading">
      <li
        v-for="post in posts"
        :key="post.id"
        class="mb-4 p-4 rounded-md border border-whitebg dark:border-wtext bg-whitebg dark:bg-bprimary"
      >
        <div>
          <h2 class="text-lg font-semibold text-bprimary dark:text-wtext">
            {{ post.title }}
          </h2>
          <p class="text-sm text-bprimary dark:text-wtext mb-2">
            Auteur : {{ post.author?.name || "Inconnu" }} | Catégorie :
            {{ post.category?.name || "Aucune" }}
          </p>
          <button
            @click="removePost(post.id)"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    <p v-if="loading" class="text-whitebg dark:text-wtext">Chargement...</p>
    <p v-if="error" class="text-red-500">{{ error.message }}</p>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useToastStore } from "@/stores/toast";
import gql from "graphql-tag";

const toast = useToastStore();

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
      toast.showToast("Article supprimé avec succès !", "success");
    });
  }
}
</script>
