import { createApp, watch } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./css/main.css";
import { useGameStore } from "./stores/game";
import { LOCAL_STORAGE_NAME } from "./constants";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

// For saving and hydrating gameState
const gameStore = useGameStore();
gameStore.hydrate();

watch(
  () => gameStore.$state,
  (state) => {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(state));
  },
  { deep: true },
);
