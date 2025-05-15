<script>
import CommentItem from "../components/comments/CommentItem.vue";
import CommentForm from "../components/comments/CommentForm.vue";
import CommentList from "../components/comments/CommentList.vue";
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-16">
    <div v-if="loading" class="text-center text-wprimary">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur : {{ error.message }}
    </div>

    <article
      v-else
      class="bg-whitebg dark:bg-blackbg p-8 rounded-xl shadow-2xl"
    >
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-6"
      />
      <div
        v-if="
          auth.user &&
          (auth.user.userId === post.author?.id || auth.user.role === 'admin')
        "
        class="mt-6 text-right"
      >
        <button
          @click="handleDelete"
          class="px-4 py-2 mb-4 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
        >
          Supprimer l’article
        </button>
      </div>

      <h1 class="text-3xl font-bold text-wprimary dark:text-wtext mb-4">
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
        <CommentList
          :comments="comments"
          :auth="auth"
          :limit="commentsLimit"
          :offset="commentsOffset"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @delete="handleDeleteComment"
        />

        <!-- Ajouter un commentaire -->
        <CommentForm
          v-if="auth.isLoggedIn"
          :text="commentText"
          @update:text="commentText = $event"
          @submit="handleAddComment"
        />
        <p v-else class="text-sm text-gray-600">Connecte-toi pour commenter.</p>
      </section>
    </article>
  </section>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const route = useRoute();
const postId = route.params.id;
const auth = useAuthStore();
const toast = useToastStore();

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
        id
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

// Delete post
const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const { mutate: deletePost } = useMutation(DELETE_POST);

const handleDelete = async () => {
  const confirmDelete = confirm("Tu es sûr de vouloir supprimer cet article ?");
  if (!confirmDelete) return;

  try {
    await deletePost({ postId });
    router.push("/articles");
    toast.showToast("Article supprimé avec succès !", "success");
  } catch (err) {
    console.error("Erreur suppression article :", err);
    toast.showToast("Erreur : " + err.message, "error");
  }
};

// Delete comment
const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

const { mutate: deleteComment } = useMutation(DELETE_COMMENT);

const handleDeleteComment = async (commentId) => {
  const ok = confirm("Supprimer ce commentaire ?");
  if (!ok) return;

  try {
    await deleteComment({ commentId });
    await refetchComments();
    toast.showToast("Commentaire supprimé avec succès !", "success");
  } catch (err) {
    console.error("Erreur suppression commentaire :", err);
    toast.showToast("Erreur : " + err.message, "error");
  }
};
</script>
