<template>
  <section
    class="max-w-3xl mx-auto mt-14 mb-20 p-8 rounded-2xl shadow-xl bg-wprimary dark:bg-bprimary text-white dark:text-wtext"
  >
    <h1 class="text-3xl font-serif font-bold mb-6">Mentions Légales</h1>
    <p class="mb-4">Ce site est édité par [Ton Nom].</p>
    <p class="mb-4">Hébergeur : [Ton hébergeur].</p>
    <p class="mb-4">Contact : [Ton email ou page de contact].</p>
    <p class="text-sm mt-6">
      Dernière mise à jour : {{ new Date().getFullYear() }}
    </p>
  </section>
</template>
