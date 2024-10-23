import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddAssignment = () => {
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);

  const initialAssessmentState = {
    assessmentDesc: "",
    assessmentName: "",
    maxMarks: "",
    startDate: "",
    lastDate: "",
    timelimit: "",
    isProtected: true,
    ProctoringFor: {
      mic: { inUse: false, maxRating: 1500 },
      webcam: { inUse: false, maxRating: 1500 },
      TabSwitch: { inUse: false, maxRating: 1500 },
      multiplePersonInFrame: { inUse: false, maxRating: 1500 },
      PhoneinFrame: { inUse: false, maxRating: 1500 },
      ControlKeyPressed: { inUse: false, maxRating: 1500 },
      invisiblecam:{inUse:false,maxRating:1500}
    },
    Assessmentmodules: [{ moduleName: "", timelimit: "" }],
  };

  const [assessment, setAssessment] = useState(initialAssessmentState);

  const handleInputChange = (field, value) => {
    setAssessment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModuleInputChange = (moduleIndex, field, value) => {
    const updatedModules = assessment.Assessmentmodules.map((module, index) =>
      index === moduleIndex ? { ...module, [field]: value } : module
    );
    setAssessment((prev) => ({ ...prev, Assessmentmodules: updatedModules }));
  };

  const handleRemoveModule = (moduleIndex) => {
    const updatedModules = assessment.Assessmentmodules.filter(
      (_, index) => index !== moduleIndex
    );
    setAssessment((prev) => ({ ...prev, Assessmentmodules: updatedModules }));
  };

  const handleAddModule = () => {
    setAssessment((prev) => ({
      ...prev,
      Assessmentmodules: [
        ...prev.Assessmentmodules,
        { moduleName: "", timelimit: "" },
      ],
    }));
  };

  const handleProctoringChange = (type, field, value) => {
    setAssessment((prev) => ({
      ...prev,
      ProctoringFor: {
        ...prev.ProctoringFor,
        [type]: { ...prev.ProctoringFor[type], [field]: value },
      },
    }));
  };

  // Function to compare the current assessment with the initial state
  const isAssessmentChanged = () => {
    return (
      JSON.stringify(assessment) !== JSON.stringify(initialAssessmentState)
    );
  };
  const requiredFields = ['assessmentName', 'maxMarks', 'timelimit',];
  const handleSubmit = async () => {
    if (!isAssessmentChanged()) {
      toast.error("No changes made to the assessment.");
      return;
    }

    for (let field of requiredFields) {
      if (!assessment[field]) {
        toast.error(`The ${field} field is required.`);
        return;
      }
    }
    setloading(true);
    try {
      const jsonData = JSON.stringify(assessment);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/createModuleAssessment`,
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        console.log("Response:", response?.data);
        toast.success("Assessment submitted successfully!");
        // Reset form after successful submission
        setAssessment(initialAssessmentState);
      }
    } catch (error) {
      console.error(
        "Error submitting assessment:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to submit assessment.");
    } finally {
      setloading(false);
    }
  };

  const Loader = () => {
    return (
      <div className="w-6 h-6 border-t-4 border-blue-500 rounded-full animate-spin"></div>
    );
  };

  const handleSelect = () => {
    const allSelected = Object.keys(assessment?.ProctoringFor || {}).every(
      (key) => assessment?.ProctoringFor[key].inUse
    );
  
    // Toggle all 'inUse' fields based on the current selection status
    setAssessment((prev) => ({
      ...prev,
      ProctoringFor: Object.keys(prev?.ProctoringFor || {}).reduce((acc, key) => {
        acc[key] = {
          ...prev.ProctoringFor[key],
          inUse: !allSelected, // If all are selected, deselect them, otherwise select all
        };
        return acc;
      }, {}),
    }));
  };
  

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5 ">
      <Toaster />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center underline">
          Assessment Submissions
        </h1>
        <div className="space-y-8">
          <div className="space-y-4 border p-3">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <label className="text-xl font-semibold flex flex-row justify-between">
                  <p>Assessment Name </p>
                </label>

                <input
                  type="text"
                  placeholder="Assessment Name"
                  className="border w-full h-12 p-3"
                  value={assessment?.assessmentName || ""}
                  onChange={(e) =>
                    handleInputChange("assessmentName", e.target.value)
                  }
                />
                <label htmlFor="" className="text-xl font-semibold">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Assessment description"
                  className="border w-full h-12 p-3"
                  value={assessment?.assessmentDesc || ""}
                  onChange={(e) =>
                    handleInputChange("assessmentDesc", e.target.value)
                  }
                />
                <label className="text-xl font-semibold">Total Marks</label>
                <input
                  type="number"
                  placeholder="Max Marks"
                  className="border w-full h-12 p-3"
                  value={assessment?.maxMarks || ""}
                  onChange={(e) =>
                    handleInputChange("maxMarks", e.target.value)
                  }
                />
                 <label className="text-xl font-semibold">
                  Time Limit (mins)
                </label>
                <input
                  type="number"
                  placeholder="Time Limit"
                  className="border w-full h-12 p-3"
                  value={assessment?.timelimit || ""}
                  onChange={(e) =>
                    handleInputChange("timelimit", e.target.value)
                  }
                />


                <label className="text-xl font-semibold">
                  Date For Assessment
                </label>
                <div className="flex flex-row gap-3">
                  <label className="flex flex-col justify-center font-mono">
                    FROM
                  </label>
                  <input
                    type="datetime-local"
                    className="border w-full h-12 p-3 "
                    value={assessment?.startDate || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                  <label className="flex flex-col justify-center font-mono">
                    TO
                  </label>
                  <input
                    type="datetime-local"
                    className="border w-full h-12 p-3"
                    value={assessment?.lastDate || ""}
                    onChange={(e) =>
                      handleInputChange("lastDate", e.target.value)
                    }
                  />
                </div>

               
                <div className="flex items-center justify-between text-xl font-semibold">
                  <label>Proctoring Options</label>
                  <p className="cursor-pointer" onClick={handleSelect}>
                    {Object.keys(assessment?.ProctoringFor || {}).every(
                      (key) => assessment?.ProctoringFor[key].inUse
                    )
                      ? "Deselect All"
                      : "Select All"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4">
                  {Object?.keys(assessment?.ProctoringFor).map((key) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                          type="checkbox"
                          checked={assessment?.ProctoringFor[key].inUse}
                          onChange={(e) =>
                            handleProctoringChange(
                              key,
                              "inUse",
                              e.target.checked
                            )
                          }
                        />
                        <span className="text-gray-700 capitalize">{key}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="text-xl font-semibold">
                Assessment Modules
              </label>
              {assessment?.Assessmentmodules?.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border p-4 mb-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between">
                      <label>Module Name</label>
                      <div
                        className="bg-red-500 h-6 w-6 rounded flex items-center justify-center text-white text-xl cursor-pointer"
                        onClick={() => handleRemoveModule(moduleIndex)}
                      >
                        <FaTimes />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Module Name"
                      className="border w-full h-12 p-3"
                      value={module.moduleName || ""}
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          "moduleName",
                          e.target.value
                        )
                      }
                    />
                    <label className="text-xl font-semibold">Time Limit</label>
                    <input
                      type="number"
                      placeholder="Module Time Limit"
                      className="border w-full h-12 p-3"
                      value={module.timelimit || ""}
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          "timelimit",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddModule}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Module
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  Submitting ... <Loader />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssignment;
