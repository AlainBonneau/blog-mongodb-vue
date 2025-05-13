<template>
  <section class="mt-8 max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
    <ul v-if="!loading">
      <li v-for="user in users" :key="user.id" class="mb-2">
        <strong>{{ user.name }}</strong> - {{ user.email }} - Rôle:
        {{ user.role }}
        <select
          v-model="selectedRole[user.id]"
          @change="changeRole(user.id)"
          class="ml-4 border px-1"
        >
          <option value="utilisateur">Utilisateur</option>
          <option value="auteur">Auteur</option>
          <option value="admin">Admin</option>
        </select>

        <button
          @click="deleteUser(user.id)"
          class="ml-4 bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
        >
          Supprimer
        </button>
      </li>
    </ul>
    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error.message }}</p>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

// Chercher tous les utilisateurs
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

// Mettre à jour le role d'un utilisateur
const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role)
  }
`;

const { mutate: updateUserRoleMutation } = useMutation(UPDATE_USER_ROLE);

const selectedRole = ref({});

watchEffect(() => {
  if (users.value.length) {
    users.value.forEach((user) => {
      selectedRole.value[user.id] = user.role;
    });
  }
});

function changeRole(userId) {
  const role = selectedRole.value[userId];
  updateUserRoleMutation({ userId, role }).then(() => {
    result.refetch();
  });
}

// Supprimer un utilisateur
const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

const { mutate: deleteUserMutation } = useMutation(DELETE_USER);

function deleteUser(userId) {
  if (confirm("Confirmer la suppression de l'utilisateur ?")) {
    deleteUserMutation({ userId }).then(() => {
      result.refetch();
    });
  }
}
</script>
