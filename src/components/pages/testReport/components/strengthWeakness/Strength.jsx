import React from 'react'

const Strength = ({strongModules}) => {
  return  (
    <div className="text-gray-700">
      {/* Display Strong Modules */}
      {strongModules?.length > 0 ? (
        strongModules.map((module, index) => (
          <div key={index} className="mb-2">
            <div className="border border-green-400 rounded-lg h-auto w-[415px] px-4 py-2">
                <h3 className="font-semibold mb-2">{module?.module?.modueleInfo?.moduleName}</h3>
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
        ))
      ) : (
        <p>No strong modules.</p>
      )}
    </div>
  )
}

export default Strength