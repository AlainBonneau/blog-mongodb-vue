<template>
  <section
    class="max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1 class="text-3xl font-serif font-bold mb-6 text-whitebg dark:text-wtext">
      Modération des commentaires
    </h1>

    <ul v-if="!loading">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="mb-4 p-4 rounded-md border border-whitebg dark:border-wtext bg-whitebg dark:bg-bprimary"
      >
        <div>
          <p class="text-bprimary dark:text-wtext mb-2">{{ comment.text }}</p>
          <p class="text-sm text-bprimary dark:text-wtext mb-2">
            Auteur : {{ comment.author?.name || "Inconnu" }} | Article :
            {{ comment.post?.title || "Inconnu" }}
          </p>
          <button
            @click="removeComment(comment.id)"
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
import gql from "graphql-tag";

// Query pour récupérer tous les commentaires
const GET_COMMENTS = gql`
  query GetComments {
    comments {
      id
      text
      author {
        name
      }
      post {
        title
      }
    }
  }
`;

const { result, loading, error, refetch } = useQuery(GET_COMMENTS);
const comments = computed(() => result.value?.comments || []);

// Mutation pour supprimer un commentaire
const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

const { mutate: deleteCommentMutation } = useMutation(DELETE_COMMENT);

function removeComment(commentId) {
  if (confirm("Confirmer la suppression du commentaire ?")) {
    deleteCommentMutation({ commentId }).then(() => {
      refetch();
    });
  }
}
</script>
