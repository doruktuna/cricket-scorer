<script setup lang="ts">
import DartIcon from "@/assets/icons/dart.svg";

const props = withDefaults(
  defineProps<{
    name: string;
    isCurrentPlayer?: boolean;
    shotsLeft?: number;
  }>(),
  {
    isCurrentPlayer: false,
    shotsLeft: 3,
  },
);
</script>

<template>
  <th class="player-th">
    <div
      class="flex justify-center"
      :class="{ invisible: !isCurrentPlayer }"
    >
      <template v-if="isCurrentPlayer">
        <DartIcon
          class="w-5 h-5 fill-orange-600"
          v-for="sn in shotsLeft"
        />
      </template>
      <template v-else>
        <DartIcon
          class="w-5 h-5 fill-gray-600"
          v-for="sn in 3"
        />
      </template>
    </div>

    <p
      class="player-name"
      :class="{ 'text-orange-600': isCurrentPlayer }"
    >
      {{ name }}
    </p>
  </th>
</template>

<style lang="scss" scoped></style>
