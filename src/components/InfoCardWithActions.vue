<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import DartIcon from "@/assets/icons/dart.svg";
import UndoIcon from "@/assets/icons/undo.svg";
import RedoIcon from "@/assets/icons/redo.svg";

const gameStore = useGameStore();
</script>

<template>
  <div
    class="border-2 border-orange-600 p-4 flex flex-col items-center h-fit gap-2"
  >
    <div
      class="grid grid-cols-[auto_auto] items-center gap-x-2 gap-y-1 text-xl"
    >
      <i-heroicons-arrow-path class="w-6 h-6 text-black" />
      <span>{{ gameStore.roundNo }} /25</span>

      <i-heroicons-user class="w-6 h-6 text-black" />
      <span>{{ gameStore.currentPlayer?.name ?? "" }}</span>

      <DartIcon class="w-6 h-6 fill-black" />
      <span>{{ gameStore.lastActionString }}</span>

      <RedoIcon class="w-6 h-6 text-black" />
      <span>{{ gameStore.nextActionString }}</span>
    </div>

    <div class="flex gap-2 mt-2">
      <button
        @click="gameStore.undoAction"
        class="btn bg-blue-600 text-white disabled:bg-blue-200"
        :disabled="!gameStore.isUndoAvailable"
      >
        <UndoIcon class="w-6 h-6" />
      </button>

      <button
        @click="gameStore.redoAction"
        class="btn bg-green-600 text-white disabled:bg-green-200"
        :disabled="!gameStore.isRedoAvailable"
      >
        <RedoIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
