<script>
import Navbar from "./components/Navbar.vue";
import HeroSection from "./components/HeroSection.vue";
</script>

<template>
  <div class="min-h-screen bg-blue-100 text-gray-800 font-sans">
    <Navbar />

    <!-- Section d’accueil -->
    <main
      class="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center"
    >
      <div class="flex-1 space-y-6">
        <h2 class="text-4xl md:text-5xl font-serif text-blue-900">
          Bienvenue sur le blog
        </h2>
        <p class="text-lg text-blue-900">
          Découvrez des articles inspirants et des conseils sur une variété de
          sujets. Explorez, apprenez et grandissez avec nous.
        </p>
        <button
          class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Commencer la lecture
        </button>
      </div>

      <HeroSection />
    </main>
  </div>
</template>

<script setup>
// pas besoin de logique JS pour l’instant
</script>

<style scoped>
/* On ajoutera la police personnalisée plus tard */
</style>
