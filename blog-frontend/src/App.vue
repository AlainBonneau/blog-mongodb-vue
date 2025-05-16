<template>
  <div
    class="min-h-screen flex flex-col bg-whitebg dark:bg-blackbg text-gray-800 font-sans"
  >
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Toast from "./components/Toast.vue";
</script>
