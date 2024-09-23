import React from "react";
import { CiTrophy, CiFlag1, CiFileOn } from "react-icons/ci";
import { MdPercent, MdOutlineCheck } from "react-icons/md";

const QuickSummery = ({ user, analysis }) => {
  // Destructure the correct and incorrect values safely
  const {
    correct = 0,
    incorrect = 0,
    accuracy = 0,
    maxMarks = 0,
    totalMarks = 0,
    attempts = 0,
    unattempted = 0,
  } = analysis || {};

  const totalQuestions = correct + incorrect + unattempted;
  const rank = user?.rank || "N/A";
  const totalUsers = user?.totalUsers || "N/A";
  const percentile = correct
    ? ((correct / totalQuestions) * 100).toFixed(2)
    : 0;

  const summaryItems = [
    {
      color: "bg-blue-300",
      label: "Rank",
      value: rank,
      totalValue: totalUsers,
      icon: <CiTrophy />,
    },
    {
      color: "bg-green-300",
      label: "Percentile",
      value: `${percentile}%`,
      icon: <CiTrophy />,
    },
    {
      color: "bg-orange-300",
      label: "Score",
      value: totalMarks,
      totalValue: maxMarks,
      icon: <CiTrophy />,
    },
    {
      color: "bg-purple-300",
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: <CiTrophy />,
    },
    {
      color: "bg-red-300",
      label: "Question Attempted",
      value: attempts,
      totalValue: totalQuestions,
      icon: <CiTrophy />,
    },
  ];

  const questionsDection = [
    { title: "Correct", value: correct },
    { title: "Incorrect", value: incorrect },
    { title: "UnAttempted", value: unattempted },
  ];

  // The ProgressBar component
  const ProgressBar = ({ percentage }) => {
    console.log(percentage);
    
    return (
      <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}` }}
        ></div>
      </div>
    );
  };

  const ProgressBar2 = ({ percentage }) => {
    const formattedPercentage = `${(percentage * 100).toFixed(2)}%`; // Multiply by 100 to convert ratio to percentage
    return (
      <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: formattedPercentage }} // Set width as percentage
        ></div>
      </div>
    );
  };
  

  return (
    <fieldset className="border border-green-500 rounded-lg w-full h-auto p-4">
      <legend className="text-lg font-semibold mb-4 text-center">
        QUICK SUMMARY
      </legend>
      {/* Summary Items */}
      <div className="grid xl:grid-cols-2 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex  items-center space-x-3">

            {/**
             * <div className="bg-purple-600 p-2 rounded-md">
          <CiTrophy className="text-3xl  text-white"/>
            </div>
             */}
            <div className={`p-2 ${item.color} rounded-md`}>
              <span className="text-xl">{item.icon}</span>
            </div>
            <div className="flex-grow">
              <p className="font-medium">{item.label}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {item.totalValue ? (
                    <div className="flex items-center gap-2">
                      <ProgressBar2 percentage={item.value / item.totalValue} />
                      <span>{`${item.value}/${item.totalValue}`}</span>
                    </div>
                  ) : item.label === "Accuracy" || "Percentile" ? (
                    <div className="flex items-center gap-2">
                      <ProgressBar percentage={item.value} />
                      {item.value}
                    </div>
                  ) : (
                    item.value
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Questions Section */}
      <div className="mt-4 flex justify-end space-x-2">
        {questionsDection.map((detect, index) => (
          <div
            key={index}
            className="bg-yellow-200 text-green-800 text-xs px-4 py-2 rounded-xl flex gap-1"
          >
            <span className="font-medium">
            {detect.title}  : 
            </span>
            <span className="font-semibold text-blue-600 ">
             {detect.value}
            </span>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default QuickSummery;
// pls check issue in progressbar