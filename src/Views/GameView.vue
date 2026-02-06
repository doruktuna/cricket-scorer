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
    <ShotButtons v-if="!gameStore.isFinished" />
    <EndGameCard v-else />
    <div class="w-fit overflow-scroll">
      <ScoreTable />
    </div>
    <InfoCardWithActions />
  </div>
</template>

<style></style>
