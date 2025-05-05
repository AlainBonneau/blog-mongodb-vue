<template>
  <div>
    <h3 class="text-xl font-bold text-wprimary dark:text-wtext mb-4">
      Commentaires
    </h3>

    <ul class="space-y-4 mb-6">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :auth="auth"
        @delete="onDelete"
      />
    </ul>

    <div class="flex justify-between items-center mb-6">
      <button
        @click="$emit('prevPage')"
        :disabled="offset === 0"
        class="px-4 py-2 bg-wprimary dark:bg-white dark:text-black text-white text-sm rounded hover:bg-opacity-98 cursor-pointer disabled:opacity-50"
      >
        Précédent
      </button>
      <button
        @click="$emit('nextPage')"
        :disabled="comments.length < limit"
        class="px-4 py-2 bg-wprimary dark:bg-white dark:text-black text-white text-sm rounded hover:bg-opacity-98 cursor-pointer disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import CommentItem from "./CommentItem.vue";

defineProps({
  comments: Array,
  auth: Object,
  limit: Number,
  offset: Number,
});

const emit = defineEmits(["prevPage", "nextPage", "delete"]);

function onDelete(commentId) {
  if (commentId) emit("delete", commentId);
}
</script>
