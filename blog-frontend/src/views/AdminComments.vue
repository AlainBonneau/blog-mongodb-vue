<template>
  <section class="mt-8 max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Modération des commentaires</h1>

    <ul v-if="!loading">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="mb-2 flex justify-between items-center border-b pb-2"
      >
        <div>
          <p>{{ comment.text }}</p>
          <p class="text-sm text-gray-600">
            Auteur : {{ comment.author?.name || "Inconnu" }} | Article :
            {{ comment.post?.title || "Inconnu" }}
          </p>
        </div>
        <button
          @click="removeComment(comment.id)"
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
