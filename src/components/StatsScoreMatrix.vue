<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import type { Player } from "@/types/cricket";

const gameStore = useGameStore();

function totalScore(players: Player[]) {
  return players.reduce((sum, p) => sum + p.score, 0);
}
</script>

<template>
  <div class="flex justify-center mt-12 w-full">
    <table class="score-table">
      <thead>
        <tr>
          <th></th>
          <th
            class="text-xl"
            v-for="p in gameStore.present.players"
          >
            {{ p.name }}
          </th>
          <th class="text-xl">Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="scorerP in gameStore.present.players">
          <td class="font-bold text-xl">{{ scorerP.name }}</td>

          <td v-for="otherP in gameStore.present.players">
            <div
              class="text-xl"
              v-if="scorerP.id != otherP.id"
            >
              {{ gameStore.inflictedTotalScore(scorerP.id, otherP.id) }}
            </div>

            <div
              class="w-full flex justify-center"
              v-if="scorerP.id != otherP.id"
            >
              <div class="max-w-36">
                {{ gameStore.inflictedScoresStr(scorerP.id, otherP.id) }}
              </div>
            </div>
          </td>

          <td>
            <div class="text-xl">
              {{ gameStore.inflictedTotalScoreToAll(scorerP.id) }}
            </div>
          </td>
        </tr>

        <tr>
          <td class="font-bold text-xl">Score</td>

          <td v-for="player in gameStore.present.players">
            <div class="text-xl">
              {{ player.score }}
            </div>
          </td>

          <td>
            <div class="text-xl">
              {{ totalScore(gameStore.present.players) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
