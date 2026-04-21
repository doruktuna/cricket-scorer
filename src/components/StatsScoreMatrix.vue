<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ref } from "vue";

const panelToShow = ref("matrix");

const gameStore = useGameStore();
</script>

<template>
  <div class="flex justify-center mt-12 w-full">
    <table class="score-table">
      <thead>
        <tr>
          <th></th>
          <th v-for="p in gameStore.present.players">{{ p.name }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="scorerP in gameStore.present.players">
          <td class="font-bold">{{ scorerP.name }}</td>
          <td v-for="otherP in gameStore.present.players">
            <div>
              {{ gameStore.inflictedTotalScore(scorerP.id, otherP.id) }}
            </div>
            <div class="w-full flex justify-center">
              <div class="max-w-36">
                {{ gameStore.inflictedScoresStr(scorerP.id, otherP.id) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
