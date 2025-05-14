<template>
  <section
    class="max-w-6xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1
      class="text-3xl font-serif font-bold text-center mb-6 text-whitebg dark:text-wtext"
    >
      🎛️ Panneau d'administration
    </h1>
    <p class="text-center text-whitebg dark:text-wtext mb-10">
      Bienvenue sur le panneau d'administration. Choisissez une section à gérer.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <router-link
        to="/admin/users"
        class="p-6 rounded-xl shadow hover:shadow-lg transition bg-whitebg text-bprimary dark:bg-bprimary dark:text-wtext hover:opacity-90"
      >
        👥 Gestion des utilisateurs
      </router-link>

      <router-link
        to="/admin/posts"
        class="p-6 rounded-xl shadow hover:shadow-lg transition bg-whitebg text-bprimary dark:bg-bprimary dark:text-wtext hover:opacity-90"
      >
        📝 Gestion des articles
      </router-link>

      <router-link
        to="/admin/comments"
        class="p-6 rounded-xl shadow hover:shadow-lg transition bg-whitebg text-bprimary dark:bg-bprimary dark:text-wtext hover:opacity-90"
      >
        💬 Modération des commentaires
      </router-link>

      <router-link
        to="/admin/categories"
        class="p-6 rounded-xl shadow hover:shadow-lg transition bg-whitebg text-bprimary dark:bg-bprimary dark:text-wtext hover:opacity-90"
      >
        🏷️ Gestion des catégories
      </router-link>
    </div>
  </section>
</template>
