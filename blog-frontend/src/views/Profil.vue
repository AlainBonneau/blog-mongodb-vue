<template>
  <section
    class="max-w-xl mx-auto mt-10 p-6 bg-whitebg dark:bg-blackbg rounded-xl shadow"
  >
    <h2
      class="text-2xl font-bold mb-6 text-wprimary dark:text-wtext text-center"
    >
      Mon profil
    </h2>

    <!-- Modifier le nom -->
    <form @submit.prevent="updateName" class="space-y-4 mb-10">
      <h3 class="text-lg font-semibold dark:text-wtext">Modifier mon nom</h3>
      <input
        v-model="newName"
        type="text"
        class="input"
        placeholder="Nouveau nom"
        required
      />
      <button
        type="submit"
        class="bg-wprimary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Enregistrer
      </button>
      <p v-if="nameMessage" class="text-sm text-green-600 mt-2">
        {{ nameMessage }}
      </p>
    </form>

    <!-- Modifier le mot de passe -->
    <form @submit.prevent="updatePassword" class="space-y-4">
      <h3 class="text-lg font-semibold dark:text-wtext">
        Changer mon mot de passe
      </h3>
      <input
        v-model="oldPassword"
        type="password"
        class="input"
        placeholder="Mot de passe actuel"
        required
      />
      <input
        v-model="newPassword"
        type="password"
        class="input"
        placeholder="Nouveau mot de passe"
        required
      />
      <button
        type="submit"
        class="bg-wprimary text-white py-2 px-4 rounded hover:bg-opacity-90"
      >
        Modifier le mot de passe
      </button>
      <p
        v-if="passMessage"
        class="text-sm mt-2"
        :class="passSuccess ? 'text-green-600' : 'text-red-600'"
      >
        {{ passMessage }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const newName = ref(auth.user?.name || "");

const oldPassword = ref("");
const newPassword = ref("");

const nameMessage = ref("");
const passMessage = ref("");
const passSuccess = ref(true);

const UPDATE_NAME = gql`
  mutation UpdateUserName($name: String!) {
    updateUserName(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdateUserPassword($oldPassword: String!, $newPassword: String!) {
    updateUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

const { mutate: updateUserName } = useMutation(UPDATE_NAME);
const { mutate: updateUserPassword } = useMutation(UPDATE_PASSWORD);

async function updateName() {
  try {
    await updateUserName({ name: newName.value });
    nameMessage.value = "Nom mis à jour avec succès.";
  } catch (err) {
    nameMessage.value = "Erreur : " + err.message;
  }
}

async function updatePassword() {
  try {
    await updateUserPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    passSuccess.value = true;
    passMessage.value = "Mot de passe modifié.";
    oldPassword.value = "";
    newPassword.value = "";
  } catch (err) {
    passSuccess.value = false;
    passMessage.value = "Erreur : " + err.message;
  }
}
</script>
