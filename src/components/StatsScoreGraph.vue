<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const colors = [
  "f35b04",
  "3d348b",
  "8ac926",
  "1982c4",
  "023047",
  "446332",
  "7678ed",
  "ffbe0b",
];

const gs = useGameStore();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: "Score" },
    },
  },
};

const rounds = computed(() =>
  Array.from({ length: gs.present.roundNo }, (_, i) => `${i + 1}`),
);

const sh = gs.present.scoreHistory;

const chartData = computed(() => ({
  labels: rounds.value,
  datasets: gs.players.map((player) => ({
    label: player.name,
    backgroundColor: `#${colors[player.id]}`,
    borderColor: `#${colors[player.id]}`,
    data: gs.present.scoreHistory[player.id] || [],
    tension: 0.1,
  })),
}));
</script>

<template>
  <div class="flex justify-center mt-12 w-full">
    <div class="graph-container h-[60vh] w-[80vw]">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
