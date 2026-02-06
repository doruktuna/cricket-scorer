<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import CupStar from "@/assets/icons/cup-star.svg";
import { computed } from "vue";
import router from "@/router";

const gameStore = useGameStore();

function newGame() {
  gameStore.resetGameState();
  router.replace({ name: "setup" });
}
</script>

<template>
  <div
    class="bg-gray-300 border-2 border-orange-600 p-4 flex flex-col items-stretch h-fit gap-2"
  >
    <p class="bg-blue-600 text-white font-bold p-2 rounded-sm">GAME FINISHED</p>

    <div
      class="bg-purple-600 text-white font-bold p-2 rounded-sm flex flex-col items-center gap-2"
    >
      <CupStar class="w-10 h-10 text-white fill-white" />
      <p
        v-for="p in gameStore.winners"
        class="text-xl font-bold"
      >
        {{ p.name }}
      </p>
    </div>

    <button
      @click="gameStore.restartGame"
      class="btn bg-orange-600 text-white font-bold"
    >
      <p class="text-lg">RESTART</p>
    </button>

    <button
      @click="newGame"
      class="btn bg-green-600 text-white font-bold"
    >
      <p class="text-lg">NEW GAME</p>
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
