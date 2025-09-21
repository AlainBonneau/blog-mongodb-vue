<template>
  <section class="mt-12">
    <h3 class="text-xl font-bold text-wprimary dark:text-wtext mb-6">
      💬 Commentaires
    </h3>

    <!-- Liste des commentaires -->
    <CommentList
      :comments="comments"
      :auth="auth"
      :limit="commentsLimit"
      :offset="commentsOffset"
      @prev-page="prevPage"
      @next-page="nextPage"
      @delete="handleDeleteComment"
    />

    <!-- Formulaire d'ajout -->
    <CommentForm
      v-if="auth.isLoggedIn"
      :text="commentText"
      @update:text="commentText = $event"
      @submit="handleAddComment"
    />

    <p v-else class="text-sm text-gray-600 mt-4">
      Connecte-toi pour commenter.
    </p>
  </section>
</template>

<script setup>
import { useComments } from "@/composables/useComments";
import CommentList from "./comments/CommentList.vue";
import CommentForm from "./comments/CommentForm.vue";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
  auth: {
    type: Object,
    required: true,
  },
});

const {
  comments,
  commentText,
  commentsLimit,
  commentsOffset,
  nextPage,
  prevPage,
  handleAddComment,
  handleDeleteComment,
} = useComments(props.postId);
</script>
