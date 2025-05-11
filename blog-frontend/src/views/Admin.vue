<template>
  <section class="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Panneau d'administration</h1>
    <p>Bienvenue sur le panneau d'administration. Sélectionnez une section :</p>
    <ul class="mt-4 space-y-2">
      <li>
        <router-link to="/admin/users">Gestion des utilisateurs</router-link>
      </li>
      <li><router-link to="/admin/posts">Gestion des articles</router-link></li>
      <li>
        <router-link to="/admin/comments"
          >Modération des commentaires</router-link
        >
      </li>
      <li>
        <router-link to="/admin/categories">Gestion des catégories</router-link>
      </li>
    </ul>
  </section>
</template>
