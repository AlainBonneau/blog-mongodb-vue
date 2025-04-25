<template>
  <header
    class="bg-wprimary text-white shadow-md dark:bg-bprimary transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-serif">Mon Blog</h1>

      <nav class="space-x-6 hidden md:block font-serif dark:text-wtext">
        <a href="/" class="hover:underline">Accueil</a>
        <a href="/articles" class="hover:underline">Articles</a>
        <a href="#" class="hover:underline">À propos</a>
        <a href="#" class="hover:underline">Contact</a>
      </nav>

      <div class="flex gap-2 items-center">
        <button
          @click="toggleDarkMode"
          class="bg-white text-wprimary font-semibold px-3 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg cursor-pointer"
        >
          {{ isDarkMode ? "☀️ Clair" : "🌙 Sombre" }}
        </button>

        <div v-if="auth.isLoggedIn">
          <button
            @click="handleLogout"
            class="bg-white text-wprimary font-semibold px-4 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg cursor-pointer"
          >
            Déconnexion
          </button>
        </div>

        <div v-else>
          <RouterLink
            to="/login"
            class="bg-white text-wprimary font-semibold px-4 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg cursor-pointer"
          >
            Connexion
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const isDarkMode = ref(false);
const auth = useAuthStore();

onMounted(() => {
  isDarkMode.value = localStorage.getItem("darkMode") === "true";
  updateHtmlClass();
});

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value);
  updateHtmlClass();
}

function handleLogout() {
  auth.logout();
  window.location.href = "/";
}

function updateHtmlClass() {
  const html = document.documentElement;
  if (isDarkMode.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}
</script>
