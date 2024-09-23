import React, { useState} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DynamicProgressBar from "./Progressbar";

const TestAnalysis = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Score");

  // Destructure the correct and incorrect values safely
  const {
    correct = 0,
    incorrect = 0,
    accuracy = 0,
    totalMarks = 0,
    attempts = 0,
  } = user?.analysis?.user || {};

  const {
    averageAccuracy = "0",
    averageAttempts = "0",
    averageCorrect = "0",
    averageIncorrect = "0",
    averageMarks = "0",
    highestAccuracy = 0,
    highestAttempts = 0,
    highestCorrect = 0,
    highestIncorrect = 0,
    highestMarks = 0,
  } = user?.analysis?.allUsers || {};

  // console.log(highestMarks);

  const totalUsers = user?.totalUsers || 100; // Assuming 100 users if not provided

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getChartData = () => {
    switch (activeTab) {
      case "Score":
        return [
          { name: "You", value: totalMarks },
          { name: "Topper", value: highestMarks },
          { name: "Average", value: averageMarks },
        ];
      case "Correct":
        return [
          { name: "You", value: correct },
          { name: "Topper", value: highestCorrect },
          { name: "Average", value: averageCorrect },
        ];
      case "Incorrect":
        return [
          { name: "You", value: incorrect },
          { name: "Topper", value: highestIncorrect },
          { name: "Average", value: averageIncorrect },
        ];
      case "Accuracy":
        return [
          { name: "You", value: accuracy },
          { name: "Topper", value: highestAccuracy },
          { name: "Average", value: averageAccuracy },
        ];
      case "Attempt":
        return [
          { name: "You", value: attempts },
          { name: "Topper", value: highestAttempts },
          { name: "Average", value: averageAttempts },
        ];
      default:
        return [];
    }
  };

  const getCategoryColor = () => {
    switch (activeTab) {
      case "Score":
        return "#5cbdb9";
      case "Accuracy":
        return "#ff0028";
      case "Attempt":
        return "#657a00";
      case "Correct":
        return "#F7882F";
      case "Incorrect":
        return "#e1b382";
      case "Time":
        return "#2c3e50";
      default:
        return "#8884d8";
    }
  };

  return (
    <fieldset className="border border-green-500 rounded-lg p-6 w-full h-auto">
      <legend className="text-lg font-semibold mb-6 text-center">
        COMPARISON
      </legend>

      {/* Tab Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {["Score", "Accuracy", "Attempt", "Correct", "Incorrect", "Time"].map(
          (tab, index) => (
            <button
              key={index}
              className={`border py-2 px-6 h-[38px] w-[177px] rounded-full font-semibold `}
              style={{
                borderColor: activeTab === tab ? getCategoryColor() : "#22c55e",
                color: activeTab === tab ? "white" : "#22c55e",
                backgroundColor:
                  activeTab === tab ? getCategoryColor() : "transparent",
              }}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Bar Chart */}
      <div className="items-center grid grid-cols-2 justify-between ">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%" className="mx-auto">
            <BarChart
              data={getChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={getCategoryColor()} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">

        <p className="text-gray-800 font-semibold">Marks VS Ranks</p>
        <DynamicProgressBar
          marks={totalMarks}
          highestMarks={highestMarks}
          rank={user?.rank}
          totalUsers={totalUsers}
        />
        </div>
      </div>
    </fieldset>
  );
};

export default TestAnalysis;
