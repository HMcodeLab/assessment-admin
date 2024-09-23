import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: "Students",
        font: {
          size: 16,
        },
      },
      beginAtZero: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
      Label: "Rank",
    },
    x: {
      title: {
        display: true,
        text: "Rank",
        font: {
          size: 16,
        },
      },
      ticks: {
        font: {
          size: 12,
          weight: "normal",
        },
      },
      grid: {
        display: false,
      },
    },
  },
};

const BarChart = ({ rankCount = {} }) => {
  // Ensure rankCount is an object
  const safeRankCount =
    rankCount && typeof rankCount === "object" ? rankCount : {};

  // Generate an array of ranks (1-10)
  const labels = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  // Map the rank counts to the correct label (rank 1, rank 2, etc.)
  const rankData = labels.map((label) => safeRankCount[label] || 0); // Default to 0 if the rank doesn't exist

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Rank",
        data: rankData, // Use the dynamically generated rank data
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex justify-center items-center mt-8  bg-white shadow-2xl rounded-xl px-6 py-4 xl:w-[30%] border-t ">
      <div className=" flex items-center justify-center py-10">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
