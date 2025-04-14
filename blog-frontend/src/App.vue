<template>
  <div
    class="min-h-screen bg-whitebg dark:bg-blackbg text-gray-800 font-sans"
  >
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>
