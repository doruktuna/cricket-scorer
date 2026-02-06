<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import DartBoard from "@/assets/icons/dart-board.svg";
import router from "@/router";

const gameStore = useGameStore();

function restartGame() {
  if (confirm("Are you sure you want to restart the game?")) {
    gameStore.restartGame();
  }
}

function newGame() {
  if (confirm("Are you sure you want to start a new game?")) {
    gameStore.resetGameState();
    router.replace({ name: "setup" });
  }
}
</script>

<template>
  <header
    class="px-[5%] py-2 w-full border-b-2 bg-gray-700 border-orange-600 flex flex-col gap-2 items-center md:flex-row"
  >
    <div class="header-left md:flex-1 flex items-center gap-4">
      <DartBoard class="w-8 h-8" />
    </div>

    <div class="header-center md:shrink-0 flex items-center gap-2">
      <p class="text-orange-600 font-bold text-xl">CRICKET SCORER</p>
    </div>

    <div class="header-right md:flex-1 flex items-center justify-end gap-3">
      <button
        @click="restartGame"
        class="btn-sm bg-orange-600 text-white font-bold"
      >
        RESTART
      </button>

      <button
        @click="newGame"
        class="btn-sm bg-green-600 text-white font-bold"
      >
        NEW GAME
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
