<template>
  <header
    class="bg-wprimary text-white shadow-md dark:bg-bprimary transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <h1 class="text-2xl font-serif">Mon Blog</h1>

      <!-- Bouton menu mobile -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden focus:outline-none"
      >
        <span class="text-3xl">☰</span>
      </button>

      <!-- Navigation principale (desktop) -->
      <nav class="hidden md:flex space-x-6 font-serif dark:text-wtext">
        <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
        <RouterLink to="/articles" class="hover:underline">Articles</RouterLink>
        <RouterLink to="#" class="hover:underline">À propos</RouterLink>
        <RouterLink to="#" class="hover:underline">Contact</RouterLink>
      </nav>

      <!-- Actions (dark mode / login / logout) -->
      <div class="hidden md:flex gap-2 items-center">
        <button
          @click="toggleDarkMode"
          class="bg-white text-wprimary font-semibold px-3 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg transition"
        >
          {{ isDarkMode ? "☀️ Clair" : "🌙 Sombre" }}
        </button>

        <template v-if="auth.isLoggedIn">
          <RouterLink
            to="/profil"
            class="bg-white text-wprimary font-semibold px-4 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg transition"
          >
            Profil
          </RouterLink>
          <button
            @click="handleLogout"
            class="bg-white text-wprimary font-semibold px-4 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg transition"
          >
            Déconnexion
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="bg-white text-wprimary font-semibold px-4 py-2 rounded hover:bg-blue-100 dark:bg-blackbg dark:text-wtext dark:hover:bg-wtext dark:hover:text-blackbg transition"
          >
            Connexion
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- Menu mobile -->
    <div
      v-if="isMenuOpen"
      class="md:hidden px-4 pb-4 space-y-2 font-serif bg-whitebg dark:bg-blackbg dark:text-wtext transition"
    >
      <RouterLink
        to="/"
        class="block hover:underline text-wprimary dark:text-wtext"
        >Accueil</RouterLink
      >
      <RouterLink
        to="/articles"
        class="block hover:underline text-wprimary dark:text-wtext"
        >Articles</RouterLink
      >
      <RouterLink
        to="#"
        class="block hover:underline text-wprimary dark:text-wtext"
        >À propos</RouterLink
      >
      <RouterLink
        to="#"
        class="block hover:underline text-wprimary dark:text-wtext"
        >Contact</RouterLink
      >

      <hr class="my-2 border-wprimary dark:border-wtext/30" />

      <button
        @click="toggleDarkMode"
        class="w-full text-left px-2 py-1 text-wprimary dark:text-wtext hover:underline"
      >
        {{ isDarkMode ? "☀️ Mode clair" : "🌙 Mode sombre" }}
      </button>

      <div>
        <template v-if="auth.isLoggedIn">
          <button
            @click="handleLogout"
            class="w-full text-left px-2 py-1 text-red-600 hover:underline"
          >
            Déconnexion
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="block text-left px-2 py-1 text-wprimary dark:text-wtext hover:underline"
          >
            Connexion
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const isDarkMode = ref(false);
const isMenuOpen = ref(false);
const auth = useAuthStore();
const router = useRouter();

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
  router.push("/");
}

function updateHtmlClass() {
  const html = document.documentElement;
  html.classList.toggle("dark", isDarkMode.value);
}
</script>
