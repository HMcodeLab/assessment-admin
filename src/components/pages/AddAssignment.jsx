import React, { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddAssignment = () => {
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    setAssessment((prev) => ({
      ...prev,
      haveCodingAssessment: checked,
    }));
  };

  const handleProblemChange = (difficulty, key, value) => {
    setAssessment((prev) => ({
      ...prev,
      problems: {
        ...prev.problems,
        [difficulty]: {
          ...prev.problems[difficulty],
          [key]:
            key === "topicTags"
              ? value.split(",").map((tag) => tag.trim())
              : value,
        },
      },
    }));
  };

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
      invisiblecam: { inUse: false, maxRating: 1500 },
    },
    Assessmentmodules: [{ moduleName: "", timelimit: "",noOfQuestions:"" }],
    problems: {
      easy: { noOfProblems: 0, topicTags: [] },
      medium: { noOfProblems: 0, topicTags: [] },
      hard: { noOfProblems: 0, topicTags: [] },
    },
    haveCodingAssessment: isChecked,
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
  const requiredFields = ["assessmentName", "maxMarks", "timelimit"];

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
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
      // console.log("Assessment Data:", assessment);

      // return;
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

  const topics = [
    "arrays",
    "strings",
    "tree",
    "hash",
    "matrix",
    "graph",
    "linked list",
    "stack",
    "binary search tree",
    "queue",
    "map",
    "heap",
    "trie",
    "segment-tree",
    "tree",
    "pointer",
    "avl-tree",
    "mathematical",
    "dynamic programming",
    "sorting",
    "bit magic",
    "greedy",
    "recursion",
    "searching",
    "Binary Search",
    "two-pointer-algorithm",
    "DFS",
    "BFS",
    "sliding-window",
    "backtracking",
    "divide and conquer",
    "prefix-sum",
    "merge sort",
  ];

  return (
    <div className=" bg-gray-100 flex items-center justify-center mt-0 px-4 py-4 h-auto">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full ">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 items-center">
            <label className=" text-gray-700 text-nowrap font-semibold">
              Assessment Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Assessment Name"
              value={assessment?.assessmentName || ""}
              onChange={(e) =>
                handleInputChange("assessmentName", e.target.value)
              }
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className=" text-gray-700 font-semibold">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Description"
              value={assessment?.assessmentDesc || ""}
              onChange={(e) =>
                handleInputChange("assessmentDesc", e.target.value)
              }
            ></textarea>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 items-center gap-4">
            <div className="flex items-center gap-2 text-nowrap">
              <label className=" text-gray-700 font-semibold">
                Total Marks
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Maximum Marks"
                value={assessment?.maxMarks || ""}
                onChange={(e) => handleInputChange("maxMarks", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className=" text-gray-700 text-nowrap font-semibold">
                Time Limit (mins)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Time Limit"
                value={assessment?.timelimit || ""}
                onChange={(e) => handleInputChange("timelimit", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <label className="text-gray-700 font-semibold">
              Date For Assessment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center md:items-start md:flex-col">
                <span>FROM</span>
                <input
                  type="datetime-local"
                  className="w-full px-12 py-2 border rounded-md"
                  placeholder="From"
                  id="startDate"
                  value={assessment?.startDate || ""}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    handleInputChange("startDate", newStartDate);

                    // Ensure start date is not after end date
                    if (
                      assessment?.lastDate &&
                      newStartDate > assessment.lastDate
                    ) {
                      handleInputChange("lastDate", newStartDate); // Adjust lastDate to be after startDate
                    }

                    setTimeout(() => {
                      document.getElementById("startDate")?.blur();
                    }, 3000);
                  }}
                />
              </div>

              <div className="flex items-center md:items-start md:flex-col">
                <span>TO</span>
                <input
                  type="datetime-local"
                  className="w-full px-12 py-2 border rounded-md"
                  placeholder="To"
                  id="lastDate"
                  value={assessment?.lastDate || ""}
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    handleInputChange("lastDate", newEndDate);

                    // Ensure end date is not before start date
                    if (newEndDate < assessment?.startDate) {
                      // You could either show an error message or automatically adjust the date
                      toast.error("End date must be greater than start date.");
                      handleInputChange("lastDate", assessment?.startDate); // Adjust lastDate to be after startDate
                    }

                    setTimeout(() => {
                      document.getElementById("lastDate")?.blur();
                    }, 3000);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xl font-semibold text-gray-700">
            <label className="">Proctoring Options</label>
            <p className="cursor-pointer" onClick={handleSelect}>
              {Object.keys(assessment?.ProctoringFor || {}).every(
                (key) => assessment?.ProctoringFor[key].inUse
              )
                ? "Deselect All"
                : "Select All"}
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-3 my-4 grid-cols-2 ">
            {Object?.keys(assessment?.ProctoringFor).map((key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                    type="checkbox"
                    checked={assessment?.ProctoringFor[key].inUse}
                    onChange={(e) =>
                      handleProctoringChange(key, "inUse", e.target.checked)
                    }
                  />
                  <span className="text-gray-700 capitalize">{key}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-700">Modules</h3>
              <FaCirclePlus
                className="text-xl text-blue-500 cursor-pointer"
                onClick={handleAddModule}
              />
            </div>
            {assessment?.Assessmentmodules?.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className="flex md:justify-between justify-around items-center gap-4 p-4"
              >
                <div className="grid grid-cols-3 lg:grid-cols-2  gap-4 w-full">
                  <div className="flex items-center md:flex-col md:items-start  gap-2">
                    <label className="text-gray-700 whitespace-nowrap">
                      Module Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Module Name"
                      value={module.moduleName || ""}
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          "moduleName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center md:flex-col md:items-start  gap-2">
                    <label className="text-gray-700 whitespace-nowrap">
                      Time Limit
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Time Limit"
                      min={0}
                      max={300}
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
                <div className="flex items-center md:flex-col md:items-start  gap-2">
                <label className="text-gray-700 whitespace-nowrap">
                      Total Ques.
                    </label>
                    <input
                      type="number"
                      placeholder="number of questions"
                      className="border w-full h-12 p-3"
                      value={module?.noOfQuestions || ""}
                      min={0}
                      max={200}
                      onChange={(e) => {
                        handleModuleInputChange(
                          moduleIndex,
                          "noOfQuestions",
                          e.target.value
                        );
                      }}
                    />
                    </div>
                </div>
                <ImCross
                  className="text-xl text-red-500 cursor-pointer"
                  onClick={() => handleRemoveModule(moduleIndex)}
                />
              </div>
            ))}
          </div>
          <div>
            {/* Checkbox Section */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="codingPlatform"
                className="text-gray-700 text-xl font-bold"
              >
                Have coding Assesment
              </label>
              <input
                type="checkbox"
                id="codingPlatform"
                className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </div>

            {/* Conditionally Rendered Coding Modules Section */}
            {isChecked && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Add Coding Modules:
                </h3>
                <div className="mt-4 space-y-6">
                  {/* Iterate through problems object */}
                  {Object.entries(assessment.problems).map(
                    ([difficulty, details]) => (
                      <div
                        key={difficulty}
                        className="p-4 border rounded-lg shadow-sm "
                      >
                        <h4 className="text-lg font-bold capitalize text-gray-800">
                          {difficulty.charAt(0).toUpperCase() +
                            difficulty.slice(1)}{" "}
                          Level
                        </h4>
                        <div className="flex items-center justify-between gap-20">
                          {/* Number of Problems Input */}
                          <div className="w-full">
                            <label htmlFor={`${difficulty}-noOfProblems`}>
                              Number of Problems
                            </label>
                            <input
                              className="w-full border p-2 rounded"
                              type="number"
                              min={0}
                              id={`${difficulty}-noOfProblems`}
                              value={details.noOfProblems}
                              onChange={(e) =>
                                handleProblemChange(
                                  difficulty,
                                  "noOfProblems",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          {/* Topic Tags Input */}
                          <div className="w-full">
                            <label htmlFor={`${difficulty}-topicTags`}>
                              Topic Tags
                            </label>
                            <input
                              className="w-full border p-2 rounded"
                              type="text"
                              id={`${difficulty}-topicTags`}
                              value={details.topicTags.join(",")}
                              onChange={(e) =>
                                handleProblemChange(
                                  difficulty,
                                  "topicTags",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className=" mt-2 w-[20%] self-center p-2 bg-green-600 text-white rounded-md"
          >
            {loading ? "Submiting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
