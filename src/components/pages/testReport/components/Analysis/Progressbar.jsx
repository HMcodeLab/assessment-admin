import React, { useState } from 'react';

const DynamicProgressBar = ({ highestMarks, totalUsers, marks }) => {
  const [currentMarks, setCurrentMarks] = useState(marks);
  
  // Calculate rank and marks percentage
  const marksPercentage = (currentMarks / highestMarks) * 100;
  const rankPredict = Math.max(Math.round((highestMarks - currentMarks) * totalUsers / highestMarks), 1);

  const handleMarksChange = (e) => {
    const newMarks = Number(e.target.value);
    setCurrentMarks(newMarks);
  };

  return (
    <div className="p-4 bg-green-100 rounded-xl w-full max-w-md mx-auto">
      {/* <p className="text-gray-800 font-semibold">Marks VS Ranks</p> */}
      <div className="relative mt-10 text-sm">
        {/* Slider with Dynamic Indicator */}
        <input
          type="range"
          min="0"
          max={highestMarks}
          value={currentMarks}
          onChange={handleMarksChange}
          className="w-full bg-green-500 rounded-full cursor-pointer"
          style={{ position: 'relative', zIndex: 5 }}
        />
        
        {/* Dynamic Indicator */}
        <div
          className="absolute -top-10"
          style={{
            left: `${marksPercentage}%`,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <p className="text-gray-800 font-semibold">
            {currentMarks >= highestMarks ? '1' : rankPredict}
          </p>
          <p className="text-gray-600 text-sm">
            {currentMarks >= highestMarks ? 'Rank' : 'Rank'}
          </p>
        </div>
      </div>

      {/* Marks Display Below Slider */}
      <div className="flex justify-between">
        <p>Marks</p>
        <p>{currentMarks}/{highestMarks}</p>
      </div>
    </div>
  );
};

export default DynamicProgressBar;
