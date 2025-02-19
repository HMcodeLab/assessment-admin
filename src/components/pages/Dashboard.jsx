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
import axios from 'axios';
import Loader from '../Loader';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);


function  Dashboard() {
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
  const adminToken = localStorage.getItem("authToken");
const [testData, setTestData] = useState([]);
const [loading, setLoading] = useState(true);
const temp = true;

  useEffect(() => {
    setLoading(true);
    if (temp) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`,
          {
            headers: { Authorization: "Bearer " + adminToken },
          }
        )
        .then((response) => {
          setTestData(response?.data.data);
        })
        .catch((error) => {
          console.error("Error fetching test details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

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
  if(loading){
    return <Loader/>
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-8 p-6 h-screen bg-gray-50">
    {/* Total Assessments Card */}
    <div className='relative overflow-hidden bg-gradient-to-br from-white to-green-50 shadow-lg rounded-xl p-8 border border-green-200 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fadeIn'>
      <div className='flex flex-col items-center justify-center h-full gap-6'>
        <div className='flex flex-col items-center animate-slideDown'>
          <h1 className='text-2xl font-semibold text-gray-700 mb-2'>Total Assessments</h1>
          <div className='text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse'>
            {testData.length}
          </div>
        </div>
        <div className='absolute -right-8 -bottom-8 w-40 h-40 bg-green-300 rounded-full opacity-20 animate-spin-slow'></div>
        <div className='absolute -left-8 -top-8 w-32 h-32 bg-emerald-500 rounded-full opacity-20 animate-spin-slow'></div>
      </div>
    </div>

    {/* Line Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
        Line Chart
      </h2>
      <div className="transition-all duration-300 hover:scale-[1.02]">
        {lineData.labels.length > 0 && <Line data={lineData} width={200} height={80} />}
      </div>
    </div>

    {/* Pie Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
        Pie Chart
      </h2>
     <div className='flex items-center justify-center'>
     <div className="transition-all duration-300 hover:scale-[1.02] w-[40%]">
        {pieData.labels.length > 0 && <Pie data={pieData} width={200} height={80} />}
      </div>
     </div>
    </div>

    {/* Doughnut Chart */}
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
        Doughnut Chart
      </h2>
      <div className='flex items-center justify-center'>
      <div className="transition-all duration-300 hover:scale-[1.02] w-[40%] left-[20%]">
        {doughnutData.labels.length > 0 && <Doughnut data={doughnutData} width={200} height={80} />}
      </div>
      </div>
    </div>
</div>
  );
}

export default Dashboard;
