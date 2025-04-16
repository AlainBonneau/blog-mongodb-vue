<template>
  <div
    class="max-w-md mx-auto mt-10 p-6 bg-whitebg dark:bg-blackbg rounded-lg shadow-lg transition-all"
  >
    <h2
      class="text-2xl font-bold mb-6 text-wprimary dark:text-wtext text-center"
    >
      {{ isLoginMode ? "Connexion" : "Inscription" }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="!isLoginMode">
        <label
          class="block text-sm font-medium text-wprimary dark:text-wtext mb-1"
        >
          Nom
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Ton nom"
          class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wprimary dark:bg-bprimary dark:text-white"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-wprimary dark:text-wtext mb-1"
        >
          Email
        </label>
        <input
          v-model="form.email"
          type="email"
          placeholder="ton@email.com"
          class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wprimary dark:bg-bprimary dark:text-white"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-wprimary dark:text-wtext mb-1"
        >
          Mot de passe
        </label>
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wprimary dark:bg-bprimary dark:text-white"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-wprimary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition"
      >
        {{ isLoginMode ? "Se connecter" : "S'inscrire" }}
      </button>

      <p v-if="errorMessage" class="text-red-600 text-sm text-center">
        {{ errorMessage }}
      </p>
    </form>

    <div class="mt-6 text-center">
      <button
        @click="isLoginMode = !isLoginMode"
        class="text-sm text-wprimary dark:text-wtext hover:underline transition"
      >
        {{
          isLoginMode
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà inscrit ? Se connecter"
        }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import gql from "graphql-tag";
import { useAuthStore } from "@/stores/auth.js";

const router = useRouter();
const auth = useAuthStore();
const isLoginMode = ref(true);

const form = ref({
  name: "",
  email: "",
  password: "",
});

const errorMessage = ref("");

onMounted(() => {
  if (auth.isLoggedIn) {
    router.push("/");
  }
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

const { mutate: login } = useMutation(LOGIN_MUTATION);
const { mutate: register } = useMutation(REGISTER_MUTATION);

const handleSubmit = async () => {
  errorMessage.value = "";
  try {
    if (isLoginMode.value) {
      const { data } = await login({
        email: form.value.email,
        password: form.value.password,
      });
      auth.setToken(data.login);
      router.push("/");
    } else {
      const { data } = await register({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
      });
      auth.setToken(data.register);
    }
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>
