<script setup lang="ts">
import EndGameCard from "@/components/EndGameCard.vue";
import GameHeader from "@/components/GameHeader.vue";
import InfoCardWithActions from "@/components/InfoCardWithActions.vue";
import ScoreTable from "@/components/ScoreTable.vue";
import ShotButtons from "@/components/ShotButtons.vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
</script>

<template>
  <GameHeader />
  <div class="flex justify-center flex-wrap gap-12 mt-12">
    <ShotButtons v-if="!gameStore.present.isFinished" />
    <EndGameCard v-else />
    <div class="w-fit overflow-auto pb-8 pr-4">
      <ScoreTable />
    </div>
    <InfoCardWithActions />
  </div>
</template>

<style></style>
