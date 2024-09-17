import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

function Dashboard() {
  // Set default data to prevent undefined errors
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch or update dynamic data
  useEffect(() => {
    // Example dynamic data
    const dynamicBarData = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [15, 12, 18, 25, 22],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    const dynamicLineData = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [10, 30, 15, 35, 40],
          borderColor: 'rgba(153, 102, 255, 0.6)',
          fill: false,
        },
      ],
    };

    const dynamicPieData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          data: [200, 150, 100],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        },
      ],
    };

    const dynamicDoughnutData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          data: [170, 180, 130],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        },
      ],
    };

    // Setting the dynamic data for charts
    setBarData(dynamicBarData);
    setLineData(dynamicLineData);
    setPieData(dynamicPieData);
    setDoughnutData(dynamicDoughnutData);
  }, []);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-8 p-4 h-screen">
      {/* Bar Chart */}
      <div className=" p-4">
        <h2 className="text-xl font-bold text-center mb-4">Bar Chart</h2>
        {barData.labels.length > 0 && <Bar data={barData} width={400} height={300} />}
      </div>

      {/* Line Chart */}
      <div className=" p-4">
        <h2 className="text-xl font-bold text-center mb-4">Line Chart</h2>
        {lineData.labels.length > 0 && <Line data={lineData} width={400} height={300} />}
      </div>

      {/* Pie Chart */}
      <div className=" p-4">
        <h2 className="text-xl font-bold text-center mb-4">Pie Chart</h2>
        {pieData.labels.length > 0 && <Pie data={pieData} width={400} height={300} />}
      </div>

      {/* Doughnut Chart */}
      <div className=" p-4">
        <h2 className="text-xl font-bold text-center mb-4">Doughnut Chart</h2>
        {doughnutData.labels.length > 0 && <Doughnut data={doughnutData} width={400} height={300} />}
      </div>
    </div>
  );
}

export default Dashboard;
