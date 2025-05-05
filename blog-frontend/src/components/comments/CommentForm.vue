<template>
  <div>
    <textarea
      :value="text"
      @input="$emit('update:text', $event.target.value)"
      placeholder="Écris un commentaire..."
      class="w-full p-3 rounded border border-gray-300 dark:bg-blackbg dark:text-white focus:outline-none focus:ring-2 focus:ring-wprimary dark:focus:ring-white mb-3"
    />
    <button
      @click="$emit('submit')"
      class="bg-wprimary dark:bg-bprimary text-white px-4 py-3 rounded-lg shadow hover:bg-blue-900 cursor-pointer transition duration-300"
    >
      Envoyer
    </button>
  </div>
</template>

<script setup>
defineProps({
  text: String,
});

defineEmits(["update:text", "submit"]);
</script>
