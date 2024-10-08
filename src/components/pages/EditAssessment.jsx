import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

const EditAssignment = () => {
  const { testId } = useParams();
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);
  const [initialAssessment, setInitialAssessment] = useState(null);
  const [assessment, setAssessment] = useState(null);

  const fetchAssessmentData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getModuleAssessment/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setInitialAssessment(response?.data.data);
      setAssessment(response?.data.data);
      console.log(response?.data.data);
    } catch (error) {
      console.error("Error fetching assessment data:", error);
    }
  };

  useEffect(() => {
    if (testId) {
      fetchAssessmentData();
    }
  }, [testId]);

  const handleInputChange = (field, value) => {
    setAssessment((prev) => ({
      ...prev,
      [field]: value, // Keep the date value as is
    }));
  };

  const handleModuleInputChange = (moduleIndex, field, value) => {
    setAssessment((prev) => {
      if (!prev?.Assessmentmodules) return prev; // Ensure Assessmentmodules exists

      const updatedModules = prev.Assessmentmodules.map((module, index) => {
        if (index === moduleIndex) {
          const fields = field.split("."); // Split the field if nested (e.g., "module.moduleName")
          let updatedModule = { ...module }; // Clone the module

          // Handle nested field updates
          if (fields.length === 2) {
            updatedModule[fields[0]] = {
              ...module[fields[0]],
              [fields[1]]: value, // Update the nested field
            };
          } else {
            updatedModule[fields[0]] = value; // Update non-nested fields
          }
          return updatedModule;
        }
        return module;
      });

      return { ...prev, Assessmentmodules: updatedModules };
    });
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

  // Improved date format to catch invalid date formats with UTC time
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
  
    // Use UTC methods to ensure the input shows the correct UTC time
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  

  // Function to compare the current assessment with the initial state
  const isAssessmentChanged = () => {
    return JSON.stringify(assessment) !== JSON.stringify(initialAssessment);
  };

  const handleSubmit = async () => {
    if (!isAssessmentChanged()) {
      toast.error("No changes made to the assessment.");
      return;
    }
    setloading(true);
    try {
      const updatedAssessment = {
        ...assessment,
        startDate: new Date(
          Date.UTC(
            new Date(assessment.startDate).getFullYear(),
            new Date(assessment.startDate).getMonth(),
            new Date(assessment.startDate).getDate(),
            new Date(assessment.startDate).getHours(),
            new Date(assessment.startDate).getMinutes()
          )
        ).toISOString(),
  
        lastDate: new Date(
          Date.UTC(
            new Date(assessment.lastDate).getFullYear(),
            new Date(assessment.lastDate).getMonth(),
            new Date(assessment.lastDate).getDate(),
            new Date(assessment.lastDate).getHours(),
            new Date(assessment.lastDate).getMinutes()
          )
        ).toISOString(),
      };

      console.log("Submitting assessment:", updatedAssessment); // Log to verify payload
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/editModuleAssessment/${testId}`,
        updatedAssessment,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Assessment updated successfully!");
        fetchAssessmentData();
      }
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast.error("Error updating assessment. Please try again.");
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
      ProctoringFor: Object.keys(prev?.ProctoringFor || {}).reduce(
        (acc, key) => {
          acc[key] = {
            ...prev.ProctoringFor[key],
            inUse: !allSelected, // If all are selected, deselect them, otherwise select all
          };
          return acc;
        },
        {}
      ),
    }));
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5 ">
      <Toaster />

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center underline">
          Update Assessment
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
                  Date For Assessment
                </label>
                <div className="flex flex-row gap-3">
  <label className="flex flex-col justify-center font-mono">FROM</label>
  <input
    type="datetime-local"
    className="border w-full h-12 p-3"
    value={formatDateForInput(assessment?.startDate) || ""}
    onChange={(e) => handleInputChange("startDate", e.target.value)}
  />
  <label className="flex flex-col justify-center font-mono">TO</label>
  <input
    type="datetime-local"
    className="border w-full h-12 p-3"
    value={formatDateForInput(assessment?.lastDate) || ""}
    onChange={(e) => handleInputChange("lastDate", e.target.value)}
  />
</div>


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
                  {assessment?.ProctoringFor &&
                    Object.keys(assessment?.ProctoringFor).map((key) => (
                      <div
                        key={key}
                        className="space-y-2"
                        onChange={(e) =>
                          handleProctoringChange(key, "inUse", e.target.checked)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <input
                            className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                            type="checkbox"
                            checked={assessment?.ProctoringFor[key].inUse}
                          />
                          <span className="text-gray-700 capitalize">
                            {key}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <label className="text-xl font-semibold pt-4">
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
                      value={module?.module?.moduleName || ""} // Accessing nested 'module' property
                      onChange={
                        (e) =>
                          handleModuleInputChange(
                            moduleIndex,
                            "module.moduleName",
                            e.target.value
                          ) // Pass the full path to the handleModuleInputChange
                      }
                    />

                    <label className="text-xl font-semibold">Time Limit</label>
                    <input
                      type="number"
                      placeholder="Module Time Limit"
                      className="border w-full h-12 p-3"
                      value={module?.module?.timelimit || ""}
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          "module.timelimit",
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
              {loading ? "Updating ..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssignment;
