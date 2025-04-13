<script setup>
defineProps({
  title: String,
  excerpt: String,
  link: String,
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
    <h3 class="text-xl font-bold text-blue-800 mb-2">{{ title }}</h3>
    <p class="text-gray-700 mb-4">
      {{ excerpt }}
    </p>
    <a :href="link" class="text-blue-600 font-semibold hover:underline">
      Lire la suite →
    </a>
  </div>
</template>
