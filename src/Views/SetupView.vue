<script setup lang="ts">
import router from "@/router";
import { useGameStore } from "@/stores/game";
import { computed } from "vue";

const gameStore = useGameStore();

const numPlayers = computed(() => {
  return gameStore.players.length;
});

function startGame() {
  const emptyNames = gameStore.players.filter(
    (p) => p.name == null || p.name.trim() == "",
  );
  if (emptyNames.length > 0) {
    alert("Players can't have empty names!");
    return;
  }
  gameStore.isStarted = true;
  router.replace({ name: "game" });
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-700">
    <div class="bg-gray-200 text-black h-fit p-4 rounded-2xl">
      <h1 class="text-center text-2xl font-bold">Players</h1>

      <div
        id="player-names"
        class="mt-2 grid grid-cols-[auto_auto_auto] gap-2 items-center"
      >
        <template
          v-for="(player, ind) in gameStore.players"
          :key="player.id"
        >
          <p class="">P{{ ind + 1 }}</p>

          <input
            v-model="player.name"
            class="bg-white border p-2"
            placeholder="Name"
            size="10"
            maxlength="10"
          />

          <div class="buttons">
            <button
              @click="gameStore.swapWithPreviousPlayer(player.id)"
              tabindex="-1"
            >
              <i-heroicons-chevron-up
                class="w-6 h-6 text-blue-600 cursor-pointer"
              />
            </button>

            <button
              @click="gameStore.swapWithNextPlayer(player.id)"
              tabindex="-1"
            >
              <i-heroicons-chevron-down
                class="w-6 h-6 text-blue-600 cursor-pointer"
              />
            </button>

            <button
              @click="gameStore.removePlayerWithId(player.id)"
              tabindex="-1"
              :disabled="numPlayers <= 2"
            >
              <i-heroicons-x-mark
                class="w-6 h-6 text-red-600 cursor-pointer"
                v-if="numPlayers > 2"
              />
              <i-heroicons-x-mark
                class="w-6 h-6 text-red-300 cursor-not-allowed"
                v-else
              />
            </button>
          </div>
        </template>
      </div>

      <div
        id="actions"
        class="mt-4 flex flex-col gap-2 justify-center"
      >
        <button
          @click="gameStore.addPlayer()"
          class="btn bg-orange-600 text-white disabled:bg-orange-300"
          :disabled="numPlayers >= 8"
        >
          Add Player
        </button>
        <button
          @click="startGame"
          class="btn bg-green-600 text-white"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  height: 100%;
}
</style>
