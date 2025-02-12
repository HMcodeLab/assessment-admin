import React, { useState } from "react";
import { CiTrophy } from "react-icons/ci";

const Score = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Score");
  // Destructure the correct and incorrect values safely
  const { maxMarks = 0, totalMarks = 0 } = user?.analysis?.user || {};
  const { generatedModules = [] } = user || {};
  const cutOff = user?.analysis?.allUsers?.averageMarks || 0;

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
  };

  // Calculate average score, handle division by zero
  const averageScore = (module) => {
    const totalMarks = module?.module?.modueleInfo?.moduleTotalMarks || 0;
    const maxMarks = module?.module?.modueleInfo?.moduleMaxMarks || 1; // Avoid division by 0
    return ((totalMarks / maxMarks) * 100).toFixed(2); // Return percentage score
  };

  return (
    <fieldset className="border border-green-500 rounded-lg p-6 w-full h-auto">
      <legend className="text-lg font-semibold mb-6 text-center">
        SECTIONAL SUMMARY
      </legend>
      <div className="flex justify-center space-x-4 mb-8">
        {/* Main Score Tab */}
        <button
          className={`border border-green-400 py-2 px-6  rounded-full text-green-500 font-semibold ${
            activeTab === "Score" && "bg-green-500 text-white font-semibold"
          }`}
          onClick={() => handleSwitchTab("Score")}
        >
          Score
        </button>
        {/* Dynamic Module Tabs */}
        {generatedModules?.length > 0 &&
          generatedModules?.map((module, index) => (
            <button
              key={index}
              className={`border border-green-400 py-2 px-6 h-[38px] w-[177px] rounded-full text-green-500 font-semibold ${
                activeTab === module?.module?.modueleInfo?.moduleName &&
                "bg-green-500 text-white font-semibold"
              }`}
              onClick={() =>
                handleSwitchTab(module?.module?.modueleInfo?.moduleName)
              }
            >
              {module?.module?.modueleInfo?.moduleName}
            </button>
          ))}
      </div>

      {/* Main Score Tab Content */}
      {activeTab === "Score" && (
        <>
          <div className="flex items-center gap-2 justify-between my-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-2 rounded-md">
                <CiTrophy className="text-3xl  text-white" />
              </div>
              <div className="flex flex-col ">
                <p className="font-semibold ">Score</p>
                <span className="font-semibold flex items-center">
                  <p className="text-orange-500">{totalMarks}</p>/{maxMarks}
                </span>
              </div>
            </div>
            <div className="font-semibold flex items-center gap-1 ">
              Cut-Off : <span className="text-purple-700">{cutOff}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {generatedModules?.length > 0 &&
              generatedModules?.map((module, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="border border-green-400 rounded-lg h-auto w-[615px] px-4 py-2">
                    <h3 className="font-semibold mb-2">
                      {module?.module?.modueleInfo?.moduleName}
                    </h3>
                    <div className="flex">
                      <input
                        type="range"
                        min="0"
                        max={module?.module?.modueleInfo?.moduleMaxMarks}
                        value={module?.module?.modueleInfo?.moduleTotalMarks}
                        className="w-full"
                      />
                      <p className="text-right text-xs">
                        {module?.module?.modueleInfo?.moduleTotalMarks}/
                        {module?.module?.modueleInfo?.moduleMaxMarks}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Content for Dynamic Module Tabs */}
      {generatedModules?.map((module, index) => {
        const moduleName = module?.module?.modueleInfo?.moduleName;

        return (
          activeTab === moduleName && (
            <div key={index} className="flex flex-col gap-2">
              <div className="border border-green-400 rounded-lg h-auto w-[615px] px-4 py-2">
                <h3 className="font-semibold mb-2">{moduleName}</h3>
                <div className="flex">
                  <input
                    type="range"
                    min="0"
                    max={module?.module?.modueleInfo?.moduleMaxMarks}
                    value={module?.module?.modueleInfo?.moduleTotalMarks}
                    className="w-full"
                  />
                  <p className="text-right text-xs">
                    {module?.module?.modueleInfo?.moduleTotalMarks}/
                    {module?.module?.modueleInfo?.moduleMaxMarks}
                  </p>
                </div>
              </div>
            </div>
          )
        );
      })}
    </fieldset>
  );
};

export default Score;
