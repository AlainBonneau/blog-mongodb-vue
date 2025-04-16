import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import { apolloClient } from "./apollo";
import { DefaultApolloClient } from "@vue/apollo-composable";

const app = createApp(App);

app.provide(DefaultApolloClient, apolloClient);
app.use(router);
app.use(createPinia());
app.mount("#app");
