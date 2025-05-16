<template>
  <footer
    class="bg-wprimary dark:bg-bprimary text-white dark:text-wtext py-8 mt-20"
  >
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <p class="text-center md:text-left text-sm">
        © {{ new Date().getFullYear() }} AltTab Tous droits réservés.
      </p>
      <div class="flex gap-4 text-sm">
        <router-link to="/contact" class="hover:underline">Contact</router-link>
        <router-link to="/mentions-legales" class="hover:underline"
          >Mentions légales</router-link
        >
      </div>
    </div>
  </footer>
</template>
