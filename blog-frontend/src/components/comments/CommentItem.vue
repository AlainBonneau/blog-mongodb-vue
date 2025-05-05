<template>
  <li class="bg-white dark:bg-bprimary rounded p-4 shadow">
    <p class="text-sm text-gray-800 dark:text-wtext">{{ comment.text }}</p>
    <span class="block mt-2 text-xs text-gray-500">
      Par {{ comment.author?.name || "Anonyme" }}
    </span>
    <button
      v-if="auth.user?.role === 'admin'"
      @click="$emit('delete', comment.id)"
      class="text-red-500 text-xs mt-1 hover:underline cursor-pointer"
    >
      🗑 Supprimer
    </button>
  </li>
</template>

<script setup>
defineProps({
  comment: Object,
  auth: Object,
});

defineEmits(["delete"]);
</script>
