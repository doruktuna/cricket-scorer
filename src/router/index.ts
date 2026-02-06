import { LOCAL_STORAGE_NAME } from "@/constants";
import GameView from "@/Views/GameView.vue";
import SetupView from "@/Views/SetupView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: () => {
        // We can't use gameStore here, because it's not ready
        const savedValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) ?? "{}");
        return {
          name: savedValues.isStarted ? "game" : "setup",
        };
      },
    },
    {
      path: "/setup",
      name: "setup",
      component: SetupView,
    },
    {
      path: "/game",
      name: "game",
      component: GameView,
    },
  ],
});

export default router;
