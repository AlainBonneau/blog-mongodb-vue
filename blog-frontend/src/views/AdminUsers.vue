<template>
  <section class="max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
    <ul v-if="!loading">
      <li v-for="user in users" :key="user.id" class="mb-2">
        <strong>{{ user.name }}</strong> - {{ user.email }} - Rôle:
        {{ user.role }}
      </li>
    </ul>
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error.message }}</p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

const { result, loading, error } = useQuery(GET_USERS);

const users = computed(() => result.value?.users || []);
</script>
