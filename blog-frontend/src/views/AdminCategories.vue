<template>
  <section
    class="max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1 class="text-3xl font-serif font-bold mb-6 text-whitebg dark:text-wtext">
      Gestion des catégories
    </h1>

    <!-- Liste des catégories -->
    <ul v-if="!loading">
      <li
        v-for="category in categories"
        :key="category.id"
        class="mb-4 p-4 rounded-md border border-whitebg dark:border-wtext bg-whitebg dark:bg-bprimary flex justify-between items-center"
      >
        <span class="text-bprimary dark:text-wtext">{{ category.name }}</span>
        <button
          @click="removeCategory(category.id)"
          class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
        >
          Supprimer
        </button>
      </li>
    </ul>
    <p v-if="loading" class="text-whitebg dark:text-wtext">Chargement...</p>
    <p v-if="error" class="text-red-500">{{ error.message }}</p>

    <!-- Ajout d'une nouvelle catégorie -->
    <form @submit.prevent="addNewCategory" class="mt-6 flex gap-2">
      <input
        v-model="newCategoryName"
        type="text"
        placeholder="Nom de la catégorie"
        class="border px-2 py-1 rounded flex-1 dark:bg-bprimary dark:text-wtext dark:border-wtext"
        required
      />
      <button
        class="bg-whitebg text-bprimary dark:bg-wprimary dark:text-white px-4 py-1 rounded hover:opacity-80 transition"
      >
        Ajouter
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

// Queries et mutations
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: ID!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

// Fetch des catégories
const { result, loading, error, refetch } = useQuery(GET_CATEGORIES);
const categories = computed(() => result.value?.categories || []);

// Ajout d'une catégorie
const newCategoryName = ref("");
const { mutate: addCategoryMutation } = useMutation(ADD_CATEGORY);

function addNewCategory() {
  addCategoryMutation({ name: newCategoryName.value }).then(() => {
    newCategoryName.value = "";
    refetch();
  });
}

// Suppression d'une catégorie
const { mutate: deleteCategoryMutation } = useMutation(DELETE_CATEGORY);

function removeCategory(categoryId) {
  if (confirm("Confirmer la suppression de la catégorie ?")) {
    deleteCategoryMutation({ categoryId }).then(() => {
      refetch();
    });
  }
}
</script>
