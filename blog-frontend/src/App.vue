<template>
  <div class="min-h-screen bg-whitebg dark:bg-blackbg text-gray-800 font-sans">
    <Navbar />
    <router-view />
    <Toast />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Toast from "./components/Toast.vue";
</script>
