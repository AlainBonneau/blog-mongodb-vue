<script setup>
import { computed } from "vue";
import { useMarkdown } from "@/composables/useMarkdown";

const props = defineProps({
  title: String,
  excerpt: String,
  image: String,
  link: String,
});

const { renderMarkdown } = useMarkdown();

const cleanExcerpt = computed(() => {
  if (!props.excerpt) return "";

  const htmlContent = renderMarkdown(props.excerpt);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  let textContent = tempDiv.textContent || tempDiv.innerText || "";

  if (textContent.length > 150) {
    textContent = textContent.substring(0, 150).trim() + "...";
  }

  return textContent;
});
</script>

<template>
  <div
    class="bg-white dark:bg-bprimary rounded-lg shadow dark:shadow-gray-800 p-6 hover:shadow-md dark:hover:shadow-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
  >
    <!-- Titre -->
    <h3 class="text-xl font-bold text-wprimary dark:text-wtext mb-3">
      {{ title }}
    </h3>

    <!-- Image -->
    <img
      v-if="image"
      :src="image"
      :alt="title || 'Article Image'"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />

    <!-- Extrait nettoyé -->
    <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
      {{ cleanExcerpt }}
    </p>

    <!-- Lien de lecture -->
    <a
      :href="link"
      class="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
    >
      Lire la suite
      <svg
        class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </a>
  </div>
</template>
