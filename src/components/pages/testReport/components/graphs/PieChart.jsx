import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Figma', 'Sketch', 'XD', 'Photoshop', 'Illustrator', 'AfterEffect', 'InDesign', 'Maya'],
    datasets: [
        {
            label: 'Design Tools',
            data: [120, 150, 100, 60, 80, 90, 70, 50],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(201, 203, 207, 0.8)',
                'rgba(54, 162, 235, 0.8)',
            ],
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: false,
        },
    },
};

const PieChart = () => {
    return (
        <div className="relative mt-16  " style={{ width: '484px', height: '381.91px', marginLeft: '95px' }}>
            <div className="absolute inset-0 bg-white shadow-2xl rounded-xl p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-50"></div>
                <div className=" z-10  ">

                    <div className="h-[calc(100%-60px)] absolute top-35 left-20">
                        <Pie data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChart;





