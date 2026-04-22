<script setup lang="ts">
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
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
        </tr>
      </thead>

      <tbody>
        <tr v-for="roundNo in gameStore.present.roundNo">
          <td class="font-bold text-xl">{{ roundNo }}</td>
          <td v-for="player in gameStore.present.players">
            <div class="text-xl">
              {{
                gameStore.present.shotHistory[player.id]![roundNo - 1]?.join(
                  ", ",
                )
              }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
