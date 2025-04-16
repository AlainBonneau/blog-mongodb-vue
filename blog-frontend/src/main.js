import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";

const pinia = createPinia();
App.use(pinia);

createApp(App).use(router).mount("#app");
