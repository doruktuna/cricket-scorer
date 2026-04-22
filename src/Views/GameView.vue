<script setup lang="ts">
import EndGameCard from "@/components/EndGameCard.vue";
import GameHeader from "@/components/GameHeader.vue";
import InfoCardWithActions from "@/components/InfoCardWithActions.vue";
import ScoreTable from "@/components/ScoreTable.vue";
import ShotButtons from "@/components/ShotButtons.vue";
import StatsOverlay from "@/components/StatsOverlay.vue";
import { useGameStore } from "@/stores/game";
import { ref } from "vue";

const showStats = ref(true);

const gameStore = useGameStore();
</script>

<template>
  <GameHeader @show-stats="showStats = true" />

  <div class="flex justify-center flex-wrap gap-12 mt-12">
    <ShotButtons v-if="!gameStore.present.isFinished" />
    <EndGameCard
      v-else
      @show-stats="showStats = true"
    />

    <div class="w-fit overflow-auto pb-8 pr-4">
      <ScoreTable />
    </div>

    <InfoCardWithActions />
  </div>

  <StatsOverlay
    v-show="showStats"
    @hide-stats="showStats = false"
  />
</template>

<style></style>
