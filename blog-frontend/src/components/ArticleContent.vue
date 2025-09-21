<template>
  <div
    class="prose prose-lg dark:prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-wprimary dark:prose-headings:text-wtext prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6 prose-p:text-gray-800 dark:prose-p:text-wtext prose-p:mb-4 prose-strong:text-wprimary dark:prose-strong:text-wtext prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-wprimary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4 prose-ul:my-4 prose-ul:ml-0 prose-ol:my-4 prose-ol:ml-0 prose-li:my-1 prose-li:text-gray-800 dark:prose-li:text-wtext prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8 prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-3"
    v-html="htmlContent"
  />
</template>

<script setup>
import { computed } from "vue";
import { useMarkdown } from "@/composables/useMarkdown";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});

const { renderMarkdown } = useMarkdown();

const htmlContent = computed(() => {
  return renderMarkdown(props.content);
});
</script>
