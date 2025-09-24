<template>
  <div
    class="prose prose-lg dark:prose-invert max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-wprimary dark:prose-headings:text-wtext prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6 prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:mb-4 prose-p:leading-relaxed prose-strong:text-wprimary dark:prose-strong:text-wtext prose-strong:font-semibold prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-blockquote:border-l-4 prose-blockquote:border-wprimary dark:prose-blockquote:border-blue-400 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:rounded-r-lg prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:font-medium prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 dark:prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-ul:my-4 prose-ul:ml-0 prose-ol:my-4 prose-ol:ml-0 prose-li:my-2 prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:leading-relaxed prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8 prose-hr:border-t-2 prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:bg-white dark:prose-table:bg-gray-900 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700 prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-600 prose-td:bg-white dark:prose-td:bg-gray-900 prose-td:p-3 prose-td:text-gray-800 dark:prose-td:text-gray-200"
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
