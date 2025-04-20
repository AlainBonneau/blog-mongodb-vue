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
        — Auteur :
        <span class="italic">{{ post.author?.name || "Anonyme" }}</span>
      </div>

      <div
        class="text-gray-800 dark:text-wtext leading-relaxed whitespace-pre-line mb-10"
      >
        {{ post.content }}
      </div>

      <!-- 💬 Commentaires -->
      <section>
        <h3 class="text-xl font-bold text-wprimary dark:text-wtext mb-4">
          Commentaires
        </h3>

        <ul class="space-y-4 mb-6">
          <li
            v-for="comment in comments"
            :key="comment.id"
            class="bg-white dark:bg-bprimary rounded p-4 shadow"
          >
            <p class="text-sm text-gray-800 dark:text-wtext">
              {{ comment.text }}
            </p>
            <span class="block mt-2 text-xs text-gray-500">
              Par {{ comment.author?.name || "Anonyme" }}
            </span>
          </li>
        </ul>

        <!-- Pagination -->
        <div class="flex justify-between items-center mb-6">
          <button
            @click="prevPage"
            :disabled="commentsOffset === 0"
            class="px-4 py-2 bg-wprimary dark:bg-white dark:text-black text-white text-sm rounded hover:bg-opacity-98 cursor-pointer disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="comments.length < commentsLimit"
            class="px-4 py-2 bg-wprimary dark:bg-white dark:text-black text-white text-sm rounded hover:bg-opacity-98 cursor-pointer disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

        <!-- Ajouter un commentaire -->
        <div v-if="auth.isLoggedIn">
          <textarea
            v-model="commentText"
            placeholder="Écris un commentaire..."
            class="w-full p-3 rounded border border-gray-300 dark:bg-blackbg dark:text-white focus:outline-none focus:ring-2 focus:ring-wprimary dark:focus:ring-white mb-3"
          />
          <button
            @click="handleAddComment"
            class="bg-wprimary dark:bg-bprimary text-white px-4 py-3 rounded-lg shadow hover:bg-blue-900 cursor-pointer transition duration-300"
          >
            Envoyer
          </button>
        </div>
        <p v-else class="text-sm text-gray-600">Connecte-toi pour commenter.</p>
      </section>
    </article>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const postId = route.params.id;
const auth = useAuthStore();

// Get post
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

// Get comments
const GET_COMMENTS = gql`
  query CommentsByPost($postId: ID!, $limit: Int, $offset: Int) {
    commentsByPost(postId: $postId, limit: $limit, offset: $offset) {
      id
      text
      author {
        name
      }
    }
  }
`;

const commentsLimit = ref(5);
const commentsOffset = ref(0);

const { result: commentsResult, refetch: refetchComments } = useQuery(
  GET_COMMENTS,
  () => ({
    postId,
    limit: commentsLimit.value,
    offset: commentsOffset.value,
  })
);

const comments = computed(() => commentsResult.value?.commentsByPost || []);

function nextPage() {
  commentsOffset.value += commentsLimit.value;
  refetchComments();
}

function prevPage() {
  if (commentsOffset.value >= commentsLimit.value) {
    commentsOffset.value -= commentsLimit.value;
    refetchComments();
  }
}

// Add comment
const ADD_COMMENT = gql`
  mutation AddComment($text: String!, $post: ID!) {
    addComment(text: $text, post: $post) {
      id
    }
  }
`;
const commentText = ref("");
const { mutate: addComment } = useMutation(ADD_COMMENT);

const handleAddComment = async () => {
  if (!commentText.value.trim()) return;
  try {
    await addComment({ text: commentText.value, post: postId });
    commentText.value = "";
    await refetchComments();
  } catch (err) {
    console.error("Erreur ajout commentaire :", err);
  }
};
</script>
