import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomBarChart = ({ rankCount = {}, lowestRank  }) => {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p className="label">{`Rank : ${label}`}</p>
          <p className="intro">{`Students : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Ensure rankCount is an object
  const safeRankCount = rankCount && typeof rankCount === "object" ? rankCount : {};

  // Generate an array of ranks (1-lowestRank), ensure lowestRank is valid
  const labels = Array.from({ length: lowestRank }, (_, i) => (i + 1).toString());

  // Map the rank counts to the correct label (rank 1, rank 2, etc.)
  const rankData = labels.map((label) => safeRankCount[label] || 0);

  // Create chart data for Recharts
  const chartData = labels.map((label, i) => ({
    name: `${label}`, 
    rank: rankData[i]
  })) .filter((data) => data.rank > 0 || data.marks > 0); // Skip ranks with no students in both counts


    // Function to generate random colors
    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    console.log(getRandomColor());
    

  return (
    <div className="w-full sm:w-[90%] md:w-[100%] lg:w-[70%] xl:w-[50%] h-auto shadow-2xl rounded-2xl py-4 px-2 border-t  border-gray-100">
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }} innerRadius={3}>
        <XAxis 
          dataKey="name" 
          className="font-semibold"
          label={{ value: 'Rank', position: 'insideBottom', offset: -10 }} 
        />
        <YAxis 
        className="font-semibold"
          label={{ value: 'Students', angle: -90, position: 'insideLeft', offset: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="rank" fill={getRandomColor()} barSize={10} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
};

export default CustomBarChart;