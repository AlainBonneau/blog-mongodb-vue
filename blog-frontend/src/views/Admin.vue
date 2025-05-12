<template>
  <section class="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8">
      🎛️ Panneau d'administration
    </h1>
    <p class="text-center text-gray-600 mb-10">
      Bienvenue sur le panneau d'administration. Choisissez une section à gérer.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <router-link
        to="/admin/users"
        class="p-6 bg-wprimary text-white rounded-xl shadow hover:shadow-lg transition"
      >
        👥 Gestion des utilisateurs
      </router-link>

      <router-link
        to="/admin/posts"
        class="p-6 bg-wprimary text-white rounded-xl shadow hover:shadow-lg transition"
      >
        📝 Gestion des articles
      </router-link>

      <router-link
        to="/admin/comments"
        class="p-6 bg-wprimary text-white rounded-xl shadow hover:shadow-lg transition"
      >
        💬 Modération des commentaires
      </router-link>

      <router-link
        to="/admin/categories"
        class="p-6 bg-wprimary text-white rounded-xl shadow hover:shadow-lg transition"
      >
        🏷️ Gestion des catégories
      </router-link>
    </div>
  </section>
</template>
