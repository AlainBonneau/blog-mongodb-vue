import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const isLoggedIn = ref(!!token.value);

  function setToken(newToken) {
    token.value = newToken;
    isLoggedIn.value = true;
    localStorage.setItem("token", newToken);
  }

  function logout() {
    token.value = "";
    isLoggedIn.value = false;
    localStorage.removeItem("token");
  }

  return { token, isLoggedIn, setToken, logout };
});
