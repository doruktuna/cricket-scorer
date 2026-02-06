<script setup lang="ts">
import DartIcon from "@/assets/icons/dart.svg";
import SingleShotIcon from "@/assets/icons/single-mark.svg";
import DoubleShotIcon from "@/assets/icons/x-mark.svg";
import TripleShotIcon from "@/assets/icons/circle-with-x.svg";

const props = defineProps<{ amount: number }>();
</script>

<template>
  <td class="shot-td">
    <div class="flex justify-center">
      <SingleShotIcon
        v-if="amount == 1"
        class="w-8 h-8"
      />
      <DoubleShotIcon
        v-else-if="amount == 2"
        class="w-8 h-8"
      />
      <TripleShotIcon
        v-else-if="amount >= 3"
        class="w-8 h-8"
      />
    </div>
  </td>
</template>

<style lang="scss" scoped></style>
