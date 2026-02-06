<script setup lang="ts">
import { CRICKET_NUMBERS } from "@/constants";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
</script>

<template>
  <div class="shot-buttons flex flex-col items-center justify-center gap-2">
    <div
      class="shot-button-row flex gap-2"
      v-for="cn in CRICKET_NUMBERS"
    >
      <template v-if="cn == 25">
        <button
          @click="gameStore.shotMade(25)"
          class="btn shot-btn bg-blue-600 text-white"
          :disabled="gameStore.isAllClosedNumber(cn)"
        >
          BULL
        </button>

        <button
          @click="gameStore.shotMade(25, 2)"
          class="btn shot-btn bg-green-600 text-white"
          :disabled="gameStore.isAllClosedNumber(cn)"
        >
          BE
        </button>
      </template>

      <template v-else>
        <button
          @click="gameStore.shotMade(cn)"
          class="btn shot-btn bg-blue-600 text-white"
          :disabled="gameStore.isAllClosedNumber(cn)"
        >
          {{ cn }}
        </button>

        <button
          @click="gameStore.shotMade(cn, 2)"
          class="btn shot-btn bg-green-600 text-white"
          :disabled="gameStore.isAllClosedNumber(cn)"
        >
          D{{ cn }}
        </button>

        <button
          @click="gameStore.shotMade(cn, 3)"
          class="btn shot-btn bg-purple-600 text-white"
          :disabled="gameStore.isAllClosedNumber(cn)"
        >
          T{{ cn }}
        </button>
      </template>
    </div>

    <div class="shot-button-row flex gap-2">
      <button
        @click="gameStore.endCurrentPlayerTurn"
        class="btn shot-btn bg-red-600 text-white"
      >
        End Turn
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
