<template>
  <div class="min-h-screen bg-blue-100 text-gray-800 font-sans">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<!-- Faire la suite -->