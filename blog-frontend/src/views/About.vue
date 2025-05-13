<template>
  <section
    class="max-w-3xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1 class="text-3xl font-serif font-bold mb-6 text-whitebg dark:text-wtext">
      À propos
    </h1>
    <p class="mb-4 text-bprimary dark:text-wtext">
      Bienvenue sur
      <strong class="text-whitebg dark:text-wtext">Mon Blog</strong> !
    </p>
    <p class="mb-4 text-bprimary dark:text-wtext">
      Ce site a été créé pour permettre à nos utilisateurs de publier, commenter
      et partager des articles sur divers sujets.
    </p>
    <p class="mb-4 text-bprimary dark:text-wtext">
      Développé avec
      <strong class="text-whitebg dark:text-wtext"
        >Vue.js, GraphQL, Node.js et MongoDB</strong
      >, il s'agit d'une plateforme moderne pensée pour la communauté.
    </p>
    <p class="mb-4 text-bprimary dark:text-wtext">
      Nous croyons en l'importance de l'expression libre et du partage de
      connaissances, dans le respect et la bienveillance.
    </p>
    <p class="text-bprimary dark:text-wtext">
      Pour en savoir plus ou nous contacter, rendez-vous sur notre page
      <router-link to="/contact" class="text-whitebg underline hover:opacity-80"
        >Contact</router-link
      >.
    </p>
  </section>
</template>

<style scoped>
p {
  color: #e0edfe;
}
</style>
