import React, { useState } from "react";
import Strength from "./Strength";
import Average from "./Average";
import Weakness from "./Weakness";

const StrengthMain = ({ generatedModules }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab switching
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // Function to calculate module strength
  const categorizeModule = (module) => {
    // Ensure module and its properties exist
    if (!module || !module.modueleInfo) return "Weak";

    const totalMarks = module.modueleInfo.moduleTotalMarks || 0;
    const maxMarks = module.modueleInfo.moduleMaxMarks || 1;
    const percentage = (totalMarks / maxMarks) * 100;

    if (percentage >= 70) {
      return "Strong";
    } else if (percentage >= 40) {
      return "Average";
    } else {
      return "Weak";
    }
  };

  // Filter modules by strength
  const strongModules =
    generatedModules?.filter(
      (module) => categorizeModule(module.module) === "Strong"
    ) || [];

  const averageModules =
    generatedModules?.filter(
      (module) => categorizeModule(module.module) === "Average"
    ) || [];

  const weakModules =
    generatedModules?.filter(
      (module) => categorizeModule(module.module) === "Weak"
    ) || [];

  const tabs = [
    { title: "Strong", value: 0 },
    { title: "Average", value: 1 },
    { title: "Weak", value: 2 },
  ];

  return (
    <fieldset className="border border-green-500 rounded-lg p-6 w-full h-auto">
      <legend className="text-lg font-semibold mb-6 text-center uppercase">
        strength and Weakness
      </legend>
      <div className="flex justify-center space-x-4 mb-8">
        {tabs.map((tab, index) => {
          return (
            <button
              key={index}
              className={`border border-green-400 py-2 px-6 h-[38px] w-[177px] rounded-full text-green-500 font-semibold ${
                activeTab === tab.value &&
                "bg-green-500 text-white font-semibold"
              }`}
              onClick={() => handleTabClick(tab.value)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 0 && <Strength strongModules={strongModules} />}
        {activeTab === 1 && <Average averageModules={averageModules} />}
        {activeTab === 2 && <Weakness weakModules={weakModules} />}
      </div>
    </fieldset>
  );
};

export default StrengthMain;
