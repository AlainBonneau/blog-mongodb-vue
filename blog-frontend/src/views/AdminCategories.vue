<template>
  <section class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Gestion des catégories</h1>

    <!-- Liste des catégories -->
    <ul v-if="!loading">
      <li
        v-for="category in categories"
        :key="category.id"
        class="mb-2 flex justify-between items-center"
      >
        <span>{{ category.name }}</span>
        <button
          @click="removeCategory(category.id)"
          class="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
        >
          Supprimer
        </button>
      </li>
    </ul>
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error.message }}</p>

    <!-- Ajout d'une nouvelle catégorie -->
    <form @submit.prevent="addNewCategory" class="mt-6 flex gap-2">
      <input
        v-model="newCategoryName"
        type="text"
        placeholder="Nom de la catégorie"
        class="border px-2 py-1 rounded flex-1"
        required
      />
      <button class="bg-wprimary text-white px-4 py-1 rounded">Ajouter</button>
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
