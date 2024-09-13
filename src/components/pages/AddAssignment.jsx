 import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
// import { adminToken } from "../../api";
import { GoDownload } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";

const AddAssignment = () => {
  const { testId } = useParams();
  const adminToken = localStorage.getItem("authToken");

  console.log("chack id is comming or not", testId);
  // const params = useParams();
  // const [AssessmentId, setAssessmentId] = params.testid;

  const [assessments, setAssessments] = useState([
    {
      assessmentDesc: "",
      assessmentName: "",
      maxMarks: "",
      startDate: "",
      lastDate: "",
      timelimit: "",
      isProtected: false,
      ProctoringFor: {
        mic: { inUse: false, maxRating: 1500 },
        webcam: { inUse: false, maxRating: 1500 },
        TabSwitch: { inUse: false, maxRating: 1500 },
        multiplePersonInFrame: { inUse: false, maxRating: 1500 },
        PhoneinFrame: { inUse: false, maxRating: 1500 },
        SoundCaptured: { inUse: false, maxRating: 1500 },
      },
      Assessmentmodules: [{ moduleName: "", timelimit: "", questions: [] }],
    },
  ]);

  useEffect(() => {
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
        setAssessments([response.data]); 
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      }
    };

    if (testId) {
      fetchAssessmentData();
    }
  }, [testId]);

  const handleAddAssessment = () => {
    setAssessments([
      ...assessments,
      {
        assessmentName: "",
        maxMarks: "",
        startDate: "",
        lastDate: "",
        timelimit: "",
        isProtected: false,
        ProctoringFor: {
          mic: { inUse: false, maxRating: 1500 },
          webcam: { inUse: false, maxRating: 1500 },
          TabSwitch: { inUse: false, maxRating: 1500 },
          multiplePersonInFrame: { inUse: false, maxRating: 1500 },
          PhoneinFrame: { inUse: false, maxRating: 1500 },
          SoundCaptured: { inUse: false, maxRating: 1500 },
        },
        Assessmentmodules: [{ moduleName: "", timelimit: "", questions: [] }],
      },
    ]);
  };

  // const handleRemoveAssessment = (assessmentIndex) => {
  //   const updatedAssessments = assessments.filter(
  //     (_, i) => i !== assessmentIndex
  //   );
  //   setAssessments(updatedAssessments);
  // };

  const handleInputChange = (index, field, value) => {
    const updatedAssessments = assessments.map((assessment, i) =>
      i === index ? { ...assessment, [field]: value } : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleModuleInputChange = (
    assessmentIndex,
    moduleIndex,
    field,
    value
  ) => {
    const updatedAssessments = assessments.map((assessment, i) =>
      i === assessmentIndex
        ? {
            ...assessment,
            Assessmentmodules: assessment?.Assessmentmodules?.map((module, j) =>
              j === moduleIndex ? { ...module, [field]: value } : module
            ),
          }
        : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleRemoveModule = (assessmentIndex, moduleIndex) => {
    const updatedAssessments = assessments.map((assessment, i) =>
      i === assessmentIndex
        ? {
            ...assessment,
            Assessmentmodules: assessment?.Assessmentmodules?.filter(
              (_, idx) => idx !== moduleIndex
            ),
          }
        : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleAddModule = (assessmentIndex) => {
    const updatedAssessments = assessments?.map((assessment, i) =>
      i === assessmentIndex
        ? {
            ...assessment,
            Assessmentmodules: [
              ...assessment.Assessmentmodules,
              { moduleName: "", timelimit: "", questions: [] },
            ],
          }
        : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleProctoringChange = (index, type, field, value) => {
    const updatedAssessments = assessments?.map((assessment, i) =>
      i === index
        ? {
            ...assessment,
            ProctoringFor: {
              ...assessment.ProctoringFor,
              [type]: { ...assessment.ProctoringFor[type], [field]: value },
            },
          }
        : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleFileChange = (assessmentIndex, moduleIndex, event) => {
    const file = event.target.files[0];
    const updatedAssessments = assessments.map((assessment, i) =>
      i === assessmentIndex
        ? {
            ...assessment,
            Assessmentmodules: assessment.Assessmentmodules.map((module, j) =>
              j === moduleIndex ? { ...module, file: file } : module
            ),
          }
        : assessment
    );
    setAssessments(updatedAssessments);
  };

  const handleSubmit = async () => {
    try {
      // Convert assessments state to JSON string
      const jsonData = JSON.stringify(assessments[0]);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/createModuleAssessment`,
        jsonData, // Send JSON string directly
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Replace with your token
            "Content-Type": "application/json", // Set content type to application/json
          },
        }
      );

      console.log("Response:", response?.data);
      alert("Assessment submitted successfully!");
    } catch (error) {
      console.error(
        "Error submitting assessment:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to submit assessment.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5 ">
      <div className="w-full h-[5vh] bg-gray-100 p-1 mb-5 rounded-sm">
        <div className="flex flex-row justify-between px-4">
          <h1 className="flex flex-row gap-2 items-center  ">
            {/* <FiPlus /> Add Assessment */}
          </h1>

          <a
            href="/PAPAssessmentTemplate.xlsx"
            download
            className=" bg-gray-400 flex flex-row gap-2 items-center justify-center shadow-sm rounded-lg text-lg font-semibold w-[12vw] h-[4vh]"
          >
            <GoDownload /> Download Test Format
          </a>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center underline">
          Assessment Submissions
        </h1>

        <div className="space-y-8 ">
          {assessments?.map((assessment, index) => (
            <div key={index} className="space-y-4 border p-3">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <label className="text-xl font-semibold flex flex-row justify-between">
                    <p>Assessment Name </p>
                    {/* <div
                      className="top-4 bg-red-500 h-6 w-8 rounded flex items-center justify-center right-4 text-white text-xl cursor-pointer"
                      onClick={() => handleRemoveAssessment(index)}
                    >
                       <FaTimes />
                    </div> */}
                  </label>

                  <input
                    type="text"
                    placeholder="Assessment Name"
                    className="border w-full h-12 p-3"
                    value={assessment?.assessmentName || ""}
                    onChange={(e) =>
                      handleInputChange(index, "assessmentName", e.target.value)
                    }
                  />
                  <label className="text-xl font-semibold">Total Marks</label>
                  <input
                    type="number"
                    placeholder="Max Marks"
                    className="border w-full h-12 p-3"
                    value={assessment?.maxMarks || ""}
                    onChange={(e) =>
                      handleInputChange(index, "maxMarks", e.target.value)
                    }
                  />
                  <label className="text-xl font-semibold">
                    Date For Assessment{" "}
                  </label>
                  <div className="flex flex-row gap-3">
                    <label className="flex flex-col justify-center font-mono">
                      FROM
                    </label>
                    <input
                      type="date"
                      placeholder="Start Date"
                      className="border w-full h-12 p-3 "
                      value={assessment?.startDate || ""}
                      onChange={(e) =>
                        handleInputChange(index, "startDate", e.target.value)
                      }
                    />
                    <label className="flex flex-col justify-center font-mono">
                      TO
                    </label>
                    <input
                      type="date"
                      placeholder="Last Date"
                      className="border w-full h-12 p-3"
                      value={assessment?.lastDate || ""}
                      onChange={(e) =>
                        handleInputChange(index, "lastDate", e.target.value)
                      }
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
                      handleInputChange(index, "timelimit", e.target.value)
                    }
                  />
                  <label className="text-xl font-semibold">
                    Proctoring Options
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {Object?.keys(assessment?.ProctoringFor).map((key) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                            type="checkbox"
                            checked={assessment?.ProctoringFor[key].inUse}
                            onChange={(e) =>
                              handleProctoringChange(
                                index,
                                key,
                                "inUse",
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-gray-700 capitalize">
                            {key}
                          </span>
                        </div>
                        {/* {assessment.ProctoringFor[key].inUse && (
                          <input
                            type="number"
                            placeholder="Max Rating"
                            className="border w-full h-10 p-3"
                            value={assessment?.ProctoringFor[key].maxRating}
                            onChange={(e) =>
                              handleProctoringChange(
                                index,
                                key,
                                "maxRating",
                                e.target.value
                              )
                            }
                          />
                        )} */}
                      </div>
                    ))}
                  </div>

                  <label htmlFor="" className="text-xl font-semibold">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Assessment description"
                    className="border w-full h-12 p-3"
                    value={assessment?.assessmentDesc || ""}
                    onChange={(e) =>
                      handleInputChange(index, "assessmentDesc", e.target.value)
                    }
                  />
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
                          onClick={() => handleRemoveModule(index, moduleIndex)}
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
                            index,
                            moduleIndex,
                            "moduleName",
                            e.target.value
                          )
                        }
                      />
                      {/* <label className="text-xl font-semibold">
                        Time Limit
                      </label> */}

                      {/* <input
                        type="number"
                        placeholder="Module Time Limit"
                        className="border w-full h-12 p-3"
                        value={module.timelimit}
                        onChange={(e) =>
                          handleModuleInputChange(
                            index,
                            moduleIndex,
                            "timelimit",
                            e.target.value
                          )
                        }
                      /> */}
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(index, moduleIndex, e)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleAddModule(index)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Module
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssignment;
