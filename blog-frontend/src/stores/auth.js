import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode"; 

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const isLoggedIn = ref(!!token.value);

  // On stocke le user décodé ici
  const user = computed(() => {
    if (!token.value) return null;
    try {
      return jwtDecode(token.value); // 🔥 extrait les infos du token
    } catch {
      return null;
    }
  });

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

  return { token, isLoggedIn, user, setToken, logout };
});
