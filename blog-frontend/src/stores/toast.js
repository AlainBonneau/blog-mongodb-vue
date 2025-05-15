import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const message = ref("");
  const type = ref("success"); // "success" ou "error"
  const visible = ref(false);

  function showToast(msg, toastType = "success") {
    message.value = msg;
    type.value = toastType;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  }

  return { message, type, visible, showToast };
});
