import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

function Dashboard() {
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Revenue',
        data: [10, 15, 5, 2, 20],
        borderColor: 'rgba(153, 102, 255, 0.6)',
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [150, 200, 120],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 h-screen">
      <div className="bg-gray-100 p-4 shadow-lg ">
        <h2 className="text-xl font-bold text-center mb-4">Bar Chart</h2>
        <Bar data={barData} />
      </div>
      <div className="bg-gray-100 p-4 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Line Chart</h2>
        <Line data={lineData} />
      </div>
      <div className="bg-gray-100 p-4 shadow-lg flex flex-row justify-center">
        <h2 className="text-xl font-bold   mb-4">Pie Chart</h2>
        <Pie data={pieData} />
      </div>
      <div className="bg-gray-100 p-4 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Doughnut Chart</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}

export default Dashboard;
