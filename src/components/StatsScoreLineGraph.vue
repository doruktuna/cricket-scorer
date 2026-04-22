<script setup lang="ts">
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
};

const options = {
  responsive: true,
};
</script>

<template>
  <Line
    :data="data"
    :options="options"
  />
</template>
