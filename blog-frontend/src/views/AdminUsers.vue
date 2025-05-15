<template>
  <section
    class="max-w-4xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl transition-colors bg-wprimary dark:bg-blackbg"
  >
    <h1 class="text-3xl font-serif font-bold mb-6 text-whitebg dark:text-wtext">
      Gestion des utilisateurs
    </h1>

    <ul v-if="!loading">
      <li
        v-for="user in users"
        :key="user.id"
        class="mb-4 p-4 rounded-md border border-whitebg dark:border-wtext bg-whitebg dark:bg-bprimary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div class="text-bprimary dark:text-wtext">
          <strong>{{ user.name }}</strong> - {{ user.email }} - Rôle :
          {{ user.role }}
        </div>

        <div class="flex gap-2 items-center">
          <select
            v-model="selectedRole[user.id]"
            @change="changeRole(user.id)"
            class="border px-2 py-1 rounded dark:bg-bprimary dark:text-wtext dark:border-wtext"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="auteur">Auteur</option>
            <option value="admin">Admin</option>
          </select>
          <button
            @click="deleteUser(user.id)"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    <p v-if="loading" class="text-whitebg dark:text-wtext">Chargement...</p>
    <p v-if="error" class="text-red-500">{{ error.message }}</p>
  </section>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { useToastStore } from "@/stores/toast";
import gql from "graphql-tag";

const toast = useToastStore();

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

const { result, loading, error, refetch } = useQuery(GET_USERS);

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
    refetch(); // ✅ utilise refetch directement
    toast.showToast("Rôle mis à jour avec succès !", "success");
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
      refetch();
      toast.showToast("Utilisateur supprimé avec succès !", "success");
    });
  }
}
</script>
