<script setup lang="ts">
import { CRICKET_NUMBERS } from "@/constants";
import { useGameStore } from "@/stores/game";
import { computed } from "vue";
import PlayerTH from "./PlayerTH.vue";
import ShotTD from "./ShotTD.vue";
import XMarkIcon from "@/assets/icons/x-mark.svg";

const gameStore = useGameStore();
const leftPlayers = computed(() => {
  const numPlayers = gameStore.players.length;
  return gameStore.players.filter((p) => p.id < numPlayers / 2);
});
const rightPlayers = computed(() => {
  const numPlayers = gameStore.players.length;
  return gameStore.players.filter((p) => p.id >= numPlayers / 2);
});
</script>

<template>
  <table class="score-table w-max shrink-0 whitespace-nowrap">
    <thead>
      <!-- Player name rows with dart icons for the current player -->
      <tr>
        <PlayerTH
          v-for="p in leftPlayers"
          :key="p.id"
          :name="p.name"
          :is-current-player="
            p.id == gameStore.present.currentPlayerInd &&
            !gameStore.present.isFinished
          "
          :shots-left="gameStore.present.currentPlayerShotsLeft"
        />

        <th></th>

        <PlayerTH
          v-for="p in rightPlayers"
          :key="p.id"
          :name="p.name"
          :is-current-player="
            p.id == gameStore.present.currentPlayerInd &&
            !gameStore.present.isFinished
          "
          :shots-left="gameStore.present.currentPlayerShotsLeft"
        />
      </tr>
    </thead>

    <tbody>
      <!-- Shot Rows -->
      <tr v-for="cn in CRICKET_NUMBERS">
        <ShotTD
          v-for="p in leftPlayers"
          :amount="p.hits[cn]"
        />

        <td class="number-td">
          <div class="relative">
            <span
              class="absolute inset-0 flex items-center justify-center text-black transition-opacity duration-200 opacity-0"
              :class="{ 'opacity-100': gameStore.isAllClosedNumber(cn) }"
            >
              <XMarkIcon class="w-24 h-24" />
            </span>

            <span :class="{ 'text-gray-400': gameStore.isAllClosedNumber(cn) }">
              {{ cn == 25 ? "BE" : cn }}
            </span>
          </div>
        </td>

        <ShotTD
          v-for="p in rightPlayers"
          :amount="p.hits[cn]"
        />
      </tr>

      <!-- Score Row -->
      <tr>
        <td
          v-for="p in leftPlayers"
          class="score-td"
        >
          <p :class="{ 'winner-score': gameStore.winners.includes(p) }">
            {{ p.score }}
          </p>
        </td>
        <td></td>
        <td
          v-for="p in rightPlayers"
          class="score-td"
        >
          <p :class="{ 'winner-score': gameStore.winners.includes(p) }">
            {{ p.score }}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped></style>
