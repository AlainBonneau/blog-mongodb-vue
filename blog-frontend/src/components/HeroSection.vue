<template>
  <main
    class="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center"
  >
    <div class="flex-1 space-y-6">
      <h2 class="text-4xl md:text-5xl font-serif text-blue-900 dark:text-wtext">
        Bienvenue sur le blog
      </h2>
      <p class="text-lg text-wprimary dark:text-wtext">
        Découvrez des articles inspirants et des conseils sur une variété de
        sujets. Explorez, apprenez et grandissez avec nous.
      </p>
      <button
        class="bg-wprimary dark:bg-bprimary text-wtext px-6 py-3 rounded-lg shadow hover:bg-blue-900 cursor-pointer transition duration-300"
      >
        Commencer la lecture
      </button>
    </div>
    <div class="flex-1 mt-10 md:mt-0">
      <img
        src="/assets/bg.jpg"
        alt="Illustration du blog"
        class="w-full max-w-md mx-auto md:mx-0 rounded-lg shadow"
      />
    </div>
  </main>
</template>
