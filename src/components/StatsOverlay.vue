<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ref } from "vue";
import StatsScoreMatrix from "./StatsScoreMatrix.vue";
import CircleXIcon from "@/assets/icons/circle-with-x.svg";
import StatsShotHistory from "./StatsShotHistory.vue";

defineEmits(["hideStats"]);

const panelToShow = ref("matrix");

const gameStore = useGameStore();
</script>

<template>
  <div class="absolute top-0 left-0 h-screen w-screen bg-black/70">
    <div
      class="bg-gray-200 mt-16 rounded-2xl mx-auto w-fit p-6 pr-12 relative overflow-x-auto max-h-[90%]"
    >
      <div class="flex gap-6 justify-center">
        <button
          class="bg-green-600 rounded-lg font-bold text-white p-2 cursor-pointer hover:scale-105"
          :class="{ 'border-2 border-orange-600': panelToShow == 'matrix' }"
          @click="panelToShow = 'matrix'"
        >
          Score Matrix
        </button>

        <button
          class="bg-blue-600 rounded-lg font-bold text-white p-2 cursor-pointer hover:scale-105"
          :class="{ 'border-2 border-orange-600': panelToShow == 'history' }"
          @click="panelToShow = 'history'"
        >
          Shot History
        </button>

        <button
          class="bg-yellow-500 rounded-lg font-bold text-white p-2 cursor-pointer hover:scale-105"
          :class="{ 'border-2 border-orange-600': panelToShow == 'graph' }"
          @click="panelToShow = 'graph'"
        >
          Score Graph
        </button>

        <button
          class="bg-red-600 text-white font-bold rounded-lg p-2 cursor-pointer hover:scale-105"
          :class="{ 'border-2 border-orange-600': panelToShow == 'graph' }"
          @click="$emit('hideStats')"
        >
          Close
        </button>
      </div>

      <StatsScoreMatrix v-show="panelToShow == 'matrix'" />
      <StatsShotHistory v-show="panelToShow == 'history'" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
