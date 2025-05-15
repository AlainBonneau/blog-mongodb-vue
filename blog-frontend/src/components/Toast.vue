<template>
  <transition name="toast-slide">
    <div
      v-if="toast.visible"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
      class="fixed top-5 right-5 flex items-center gap-2 text-white px-5 py-3 rounded-xl shadow-xl transition-all"
    >
      <span v-if="toast.type === 'success'">✅</span>
      <span v-else>❌</span>
      <span>{{ toast.message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { useToastStore } from "@/stores/toast";
const toast = useToastStore();
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateX(150%);
  opacity: 0;
}
.toast-slide-enter-to,
.toast-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
