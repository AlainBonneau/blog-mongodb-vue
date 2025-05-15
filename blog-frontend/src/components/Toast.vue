<template>
  <div
    v-if="toast.visible"
    :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    class="fixed top-5 right-5 text-white px-4 py-2 rounded shadow-lg transition-opacity"
  >
    {{ toast.message }}
  </div>
</template>

<script setup>
import { useToastStore } from "@/stores/toast";
const toast = useToastStore();
</script>
