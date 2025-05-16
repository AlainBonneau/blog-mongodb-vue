<template>
  <section
    class="max-w-2xl mx-auto mt-14 mb-20 p-8 bg-wprimary dark:bg-bprimary rounded-2xl shadow-xl transition-all"
  >
    <h2 class="text-3xl font-serif font-bold mb-6 text-white text-center">
      📬 Contactez-nous
    </h2>
    <p class="text-center text-wtext mb-8">
      Une question, une proposition ou simplement envie d'échanger ? Remplissez
      le formulaire ci-dessous.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="Votre nom"
        class="w-full px-4 py-2 rounded border border-whitebg bg-white dark:bg-bprimary dark:text-wtext focus:ring-2 focus:ring-whitebg"
      />

      <input
        v-model="form.email"
        type="email"
        required
        placeholder="Votre email"
        class="w-full px-4 py-2 rounded border border-whitebg bg-white dark:bg-bprimary dark:text-wtext focus:ring-2 focus:ring-whitebg"
      />

      <textarea
        v-model="form.message"
        rows="5"
        required
        placeholder="Votre message"
        class="w-full px-4 py-2 rounded border border-whitebg bg-white dark:bg-bprimary dark:text-wtext focus:ring-2 focus:ring-whitebg"
      ></textarea>

      <button
        type="submit"
        class="w-full py-2 bg-white text-wprimary rounded font-semibold hover:bg-opacity-90 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-whitebg"
      >
        Envoyer le message
      </button>

      <p
        v-if="successMessage"
        class="text-center mt-4 text-green-400 font-semibold"
      >
        {{ successMessage }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";

const form = ref({ name: "", email: "", message: "" });
const successMessage = ref("");

const handleSubmit = async () => {
  try {
    const res = await fetch("https://formspree.io/f/xdkewgjp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (res.ok) {
      successMessage.value = "Votre message a bien été envoyé. Merci !";
      form.value = { name: "", email: "", message: "" };
    } else {
      successMessage.value = "Une erreur est survenue. Veuillez réessayer.";
    }
  } catch (error) {
    successMessage.value = "Une erreur est survenue. Veuillez réessayer.";
  }
};
</script>
