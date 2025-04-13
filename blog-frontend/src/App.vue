<script setup>
import Navbar from "./components/Navbar.vue";
import HeroSection from "./components/HeroSection.vue";
import RecentArticle from "./components/RecentArticle.vue";
</script>

<template>
  <div class="min-h-screen bg-blue-100 text-gray-800 font-sans">
    <Navbar />
    <!-- Section d’accueil -->
    <HeroSection />
    <!-- Articles récents -->
    <RecentArticle />
  </div>
</template>

<style scoped>
/* On ajoutera la police personnalisée plus tard */
</style>
