<template>
  <section
    class="max-w-2xl mx-auto mt-14 mb-20 p-8 bg-wprimary dark:bg-bprimary rounded-2xl shadow-xl transition-all"
  >
    <h2
      class="text-3xl font-serif font-bold mb-10 text-center tracking-tight text-white"
    >
      Créer un nouvel article
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-7">
      <!-- Titre -->
      <div>
        <label class="block mb-1 font-bold text-wtext"
          >Titre</label
        >
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-4 py-3 border border-wprimary/30 rounded-xl bg-white dark:bg-bprimary dark:text-wtext focus:outline-none focus:ring-2 focus:ring-wprimary focus:border-wprimary transition"
          placeholder="Titre de l'article"
        />
      </div>

      <!-- Contenu -->
      <div>
        <label class="block mb-1 font-bold text-wtext"
          >Contenu</label
        >
        <textarea
          v-model="form.content"
          rows="7"
          required
          class="w-full px-4 py-3 border border-wprimary/30 rounded-xl bg-white dark:bg-bprimary dark:text-wtext focus:outline-none focus:ring-2 focus:ring-wprimary focus:border-wprimary transition resize-y"
          placeholder="Rédige ton article ici..."
        />
      </div>

      <!-- Image -->
      <div>
        <label class="block mb-1 font-bold text-wtext"
          >Image (URL)</label
        >
        <input
          v-model="form.image"
          type="text"
          class="w-full px-4 py-3 border border-wprimary/30 rounded-xl bg-white dark:bg-bprimary dark:text-wtext focus:outline-none focus:ring-2 focus:ring-wprimary focus:border-wprimary transition"
          placeholder="https://image.com/..."
        />
        <div v-if="form.image" class="mt-4 flex justify-center">
          <img
            :src="form.image"
            alt="Prévisualisation"
            class="max-h-44 rounded-xl shadow-lg border border-wprimary/30 dark:border-wtext/10 bg-white dark:bg-bprimary p-2"
          />
        </div>
      </div>

      <!-- Catégorie -->
      <div>
        <label class="block mb-1 font-bold text-wtext"
          >Catégorie</label
        >
        <select
          v-model="form.category"
          class="w-full px-4 py-3 border border-wprimary/30 rounded-xl bg-white dark:bg-bprimary dark:text-wtext focus:outline-none focus:ring-2 focus:ring-wprimary focus:border-wprimary transition"
        >
          <option value="">-- Sélectionner --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Bouton publier -->
      <button
        type="submit"
        class="w-full py-3 rounded-xl font-bold text-lg bg-white text-wprimary dark:text-blackbg shadow-md hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-wprimary cursor-pointer"
      >
        Publier l’article
      </button>

      <p v-if="message" class="text-center mt-6 text-green-600 font-semibold">
        {{ message }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const form = ref({ title: "", content: "", image: "", category: "" });
const message = ref("");

// Query catégories
const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;
const { result: categoryResult } = useQuery(GET_CATEGORIES);
const categories = computed(() => categoryResult.value?.categories || []);

// Mutation ajout d’article
const ADD_POST = gql`
  mutation AddPost(
    $title: String!
    $content: String!
    $image: String
    $category: ID
  ) {
    addPost(
      title: $title
      content: $content
      image: $image
      category: $category
    ) {
      id
      title
    }
  }
`;
const { mutate: addPost } = useMutation(ADD_POST);

const handleSubmit = async () => {
  try {
    await addPost({
      title: form.value.title,
      content: form.value.content,
      image: form.value.image || null,
      category: form.value.category || null,
    });
    message.value = "Article publié avec succès ! 🚀";
    setTimeout(() => {
      router.push("/");
    }, 1300);
  } catch (err) {
    message.value = "Erreur : " + err.message;
  }
};
</script>
