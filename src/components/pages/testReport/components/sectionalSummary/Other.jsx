import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const EditAssessment = () => {
  const { testId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const adminToken = localStorage.getItem("authToken");

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
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      [field]: value,
    }));
  };

  const handleModuleInputChange = (moduleIndex, field, value) => {
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      Assessmentmodules: prevAssessment?.Assessmentmodules?.map((module, j) =>
        j === moduleIndex ? { ...module, [field]: value } : module
      ),
    }));
  };

  const handleRemoveModule = async (moduleIndex) => {
    try {
      const moduleId = assessment?.Assessmentmodules[moduleIndex]?._id;

      if (!moduleId || !testId) {
        toast.error("Module ID or Test ID is missing.");
        return;
      }

      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_DOMAIN}/deleteModuleFromAssessment`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          params: {
            moduleAssessmentid: testId,
            moduleid: moduleId,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        setAssessment((prevAssessment) => ({
          ...prevAssessment,
          Assessmentmodules: prevAssessment.Assessmentmodules.filter(
            (_, idx) => idx !== moduleIndex
          ),
        }));
        toast.success("Module removed successfully!", {
          position: "top-center",
        });
      } else {
        toast.error("Failed to delete the module from the assessment.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("An error occurred while deleting the module:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleAddModule = () => {
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      Assessmentmodules: [
        ...(prevAssessment.Assessmentmodules || []),
        { moduleName: "", timelimit: "" }, // Ensure moduleName and timelimit are part of the object
      ],
    }));
  };

  const handleProctoringChange = (type, field, value) => {
    setAssessment((prevAssessment) => ({
      ...prevAssessment,
      ProctoringFor: {
        ...prevAssessment.ProctoringFor,
        [type]: { ...prevAssessment.ProctoringFor[type], [field]: value },
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting assessment:", assessment); // Log to verify payload
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/editModuleAssessment/${testId}`,
        assessment,
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
    }
  };

  function formatDate(dateString) {
    const dateObj = new Date(dateString);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[dateObj.getMonth()];

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = `${hours}.${minutes}${ampm}`;

    return `${day} ${month} ${year} ${time}`;
  }
  
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5 ">
      <Toaster />
      {/* <div className="h-[5vh] p-1 mb-5 rounded-sm w-[90%]">
        <div className="flex flex-row justify-end px-4">
          <a
            href="/PAPAssessmentTemplate.xlsx"
            download
            className="bg-gray-400 flex flex-row gap-2 items-center justify-center shadow-sm rounded-lg text-lg font-semibold w-[12vw] h-[4vh]"
          >
            <GoDownload /> Download Test Format
          </a>
        </div>
      </div> */}

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
                  Date For Assessment{" "}
                </label>
                <div className="flex flex-row gap-3">
                  <label className="flex flex-col justify-center font-mono">
                    FROM
                  </label>
                  <input
                    type="datetime-local"
                    placeholder="Start Date"
                    className="border w-full h-12 p-3 "
                    value={formatDate(assessment?.startDate) || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                  <label className="flex flex-col justify-center font-mono">
                    TO
                  </label>
                  <input
                    type="datetime-local"
                    placeholder="Last Date"
                    className="border w-full h-12 p-3"
                    value={formatDate(assessment?.lastDate) || ""}
                    onChange={(e) =>
                      handleInputChange("lastDate", e.target.value)
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
                    handleInputChange("timelimit", e.target.value)
                  }
                />
                <label className="text-xl font-semibold">
                  Proctoring Options
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(assessment?.ProctoringFor || {}).map((key) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          className="cursor-pointer rounded-full form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                          type="checkbox"
                          checked={
                            assessment?.ProctoringFor[key]?.inUse || false
                          }
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
                        className="flex items-center cursor-pointer text-red-500 bg-gray-200 rounded-full w-[2vw] h-[4vh] justify-center hover:bg-green-700"
                        onClick={() => handleRemoveModule(moduleIndex)}
                      >
                        <MdDelete size={25} />
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Module Name"
                      className="border w-full h-12 p-3"
                      value={module?.moduleName || ""} // Use moduleName directly, not module.moduleName
                      onChange={(e) =>
                        handleModuleInputChange(
                          moduleIndex,
                          "moduleName",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Time Limit"
                      className="border w-full h-12 p-3"
                      value={module?.timelimit || ""} // Use timelimit directly, not module.timelimit
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
                className="flex items-center gap-2 bg-blue-600 text-white p-2 rounded"
                onClick={handleAddModule}
              >
                <FaPlus /> Add Module
              </button>
            </div>
          </div>
        </div>

        <button
          className="flex flex-row justify-center items-center bg-green-600 text-white py-3 px-6 rounded-md text-xl font-semibold"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditAssessment;
