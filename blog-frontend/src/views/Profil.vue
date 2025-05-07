<template>
  <section
    class="max-w-xl mx-auto mt-10 mb-20 p-8 bg-whitebg dark:bg-blackbg rounded-2xl shadow-2xl transition-colors"
  >
    <h2
      class="text-3xl font-serif font-bold text-wprimary dark:text-wtext text-center mb-10"
    >
      Mon profil
    </h2>

    <!-- Modifier le nom -->
    <form @submit.prevent="updateName" class="space-y-5 mb-12">
      <h3 class="text-lg font-bold text-wprimary dark:text-wtext">
        Modifier mon nom
      </h3>
      <input
        v-model="newName"
        type="text"
        class="w-full bg-white border border-gray-300 dark:bg-bprimary dark:border-gray-600 dark:text-wtext px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-wprimary"
        placeholder="Nouveau nom"
        required
      />
      <button
        type="submit"
        class="w-full bg-wprimary text-white py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
      >
        Enregistrer
      </button>
      <p
        v-if="nameMessage"
        class="text-center text-sm mt-2 text-green-600 dark:text-green-400"
      >
        {{ nameMessage }}
      </p>
    </form>

    <!-- Modifier le mot de passe -->
    <form @submit.prevent="updatePassword" class="space-y-5">
      <h3 class="text-lg font-bold text-wprimary dark:text-wtext">
        Changer mon mot de passe
      </h3>
      <input
        v-model="oldPassword"
        type="password"
        class="w-full bg-white border border-gray-300 dark:bg-bprimary dark:border-gray-600 dark:text-wtext px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-wprimary"
        placeholder="Mot de passe actuel"
        required
      />
      <input
        v-model="newPassword"
        type="password"
        class="w-full bg-white border border-gray-300 dark:bg-bprimary dark:border-gray-600 dark:text-wtext px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-wprimary"
        placeholder="Nouveau mot de passe"
        required
      />
      <button
        type="submit"
        class="w-full bg-wprimary text-white py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
      >
        Modifier le mot de passe
      </button>
      <p
        v-if="passMessage"
        class="text-center text-sm mt-2"
        :class="
          passSuccess
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        "
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
