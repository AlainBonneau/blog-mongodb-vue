<template>
  <section class="max-w-3xl mx-auto px-4 py-12">
    <div
      v-if="!auth.isLoggedIn || authUser?.role !== 'auteur'"
      class="text-center text-gray-500"
    >
      <p>Vous n'êtes pas autorisé à créer des articles.</p>
      <pre class="text-xs text-gray-600">
  {{ auth.user }}
</pre
      >
    </div>

    <div v-else class="bg-whitebg dark:bg-blackbg p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-wprimary dark:text-wtext mb-6">
        Créer un nouvel article
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-wtext mb-1">Titre</label>
          <input v-model="form.title" type="text" required class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-wtext mb-1"
            >Contenu</label
          >
          <textarea v-model="form.content" required rows="6" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-wtext mb-1"
            >Image (URL)</label
          >
          <input
            v-model="form.image"
            type="text"
            class="input"
            placeholder="https://..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-wtext mb-1"
            >Catégorie</label
          >
          <select v-model="form.category" class="input">
            <option disabled value="">-- Choisir une catégorie --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn w-full">Publier l’article</button>

        <p v-if="message" class="text-green-600 text-center">{{ message }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const auth = useAuthStore();
const authUser = computed(() => auth.user || null);

const form = ref({
  title: "",
  content: "",
  image: "",
  category: "",
});

const message = ref("");

// 🧩 Query des catégories
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

// ✏️ Mutation d'ajout d’article
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
    message.value = "Article publié avec succès !";
    form.value = { title: "", content: "", image: "", category: "" };
  } catch (err) {
    message.value = "Erreur : " + err.message;
  }
};
</script>
