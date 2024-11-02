import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoDownload } from "react-icons/go";
import Loader from "../Loader";

const AddQuestions = () => {
  const [Allmodules, setAllmodules] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(""); // For assessmentmoduleid
  const [loading, setloading] = useState(false);
  const [submodulearray, setsubmodulearray] = useState([]);
  const [selectedModule, setSelectedModule] = useState(""); // For moduleid
  const adminToken = localStorage.getItem("authToken");
  const [loader, setloader] = useState(true);

  // Fetch all assessments and their submodules (modules)
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`,
        {
          headers: {
            Authorization: "Bearer " + adminToken,
          },
        }
      );
      if (response && response.data) {
        const modules = response.data.data.map((assessment) => ({
          assessmentName: assessment.assessmentName,
          assessmentmoduleid: assessment._id, // Unique ID for the assessment
          submodules:
            assessment.Assessmentmodules.map((sub) => sub.module) || [], // Submodules
        }));
        setAllmodules(modules);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloader(false);
    }
  };
  let temp = true;
  useEffect(() => {
    if (temp) {
      fetchData();
      temp = false;
    }
  }, []);

  // Handle assessment (module) selection
  const handleAssessmentChange = (event) => {
    const selectedAssessmentId = event.target.value;
    setSelectedAssessment(selectedAssessmentId);

    // Find the selected assessment's submodules
    const selectedAssessment = Allmodules.find(
      (assessment) => assessment.assessmentmoduleid === selectedAssessmentId
    );
    if (selectedAssessment) {
      setsubmodulearray(selectedAssessment.submodules); // Set submodules
    } else {
      setsubmodulearray([]);
    }
  };

  // Handle submodule selection (for moduleid)
  const handleSubmoduleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setloading(true);
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];

    if (!selectedAssessment || !selectedModule || !file) {
      toast.error(
        "Please select an assessment, a module, and a file to upload."
      );
      setloading(false);
      return;
    }

    // Check if the uploaded file is an Excel file
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedFileTypes.includes(file.type)) {
      toast.error("Only Excel files (.xlsx, .xls) are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("moduleAssessmentid", selectedAssessment); // Ensure this matches server's expected name
    formData.append("moduleId", selectedModule); // Ensure this matches server's expected name
    formData.append("questions", file); // Ensure 'file' matches server's expected field name
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/addQuestionsToModuleAssessment`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + adminToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Questions added successfully!");
        setSelectedAssessment("");
        setsubmodulearray([]);
        setSelectedModule("");
        fileInput.value = ""; // Reset file input
      }
    } catch (error) {
      console.error("Error adding questions:", error);
      toast.error("Error adding questions. Please try again.");
    } finally {
      setloading(false);
    }
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="p-5 overflow-hidden">
      <Toaster />
      <form className="flex items-center justify-center gap-5  md:flex-col lg:flex-row ">
        <div className="flex flex-col gap-4 p-10 bg-white rounded-xl 2xl:w-full md:w-full sm:w-full lg:w-full xl:w-full shadow-md">
          <label htmlFor="module" className="whitespace-nowrap font-semibold">
            Select An Assesment
          </label>
          <select
            name="module"
            id="module"
            value={selectedAssessment}
            onChange={handleAssessmentChange}
            className="px-4 py-2 w-full rounded-md border-2 border-gray-400 focus:outline-none placeholder-gray-400"
          >
            <option value="" disabled className="text-gray-400">
              Select an assessment
            </option>
            {Allmodules?.map((assessment) => (
              <option
                key={assessment.assessmentmoduleid}
                value={assessment.assessmentmoduleid}
              >
                {assessment.assessmentName}
              </option>
            ))}
          </select>

          <label
            htmlFor="submodule"
            className="whitespace-nowrap font-semibold "
          >
            Select Module
          </label>
          <select
            name="submodule"
            id="submodule"
            value={selectedModule}
            onChange={handleSubmoduleChange}
            className="px-4 py-2 w-full focus:outline-none rounded-md border-2 border-gray-400 placeholder-gray-400"
          >
            <option value="" disabled>
              Select Module
            </option>
            {submodulearray?.map((submodule) => (
              <option key={submodule._id} value={submodule._id}>
                {submodule.moduleName}
              </option>
            ))}
          </select>

          <label
            htmlFor="fileUpload"
            className="whitespace-nowrap font-semibold"
          >
            Choose File
          </label>
          <input
            // onChange={handleFileChange}
            type="file"
            id="fileUpload"
            accept=".xls,.xlsx"
            className="border-2 border-gray-400 p-1 rounded-md placeholder-gray-400"
          />
          <button
            type="submit"
            className="p-4 bg-[#1fc074] rounded text-white w-1/2 font-semibold mx-auto "
            onClick={handleSubmit}
          >
            {loading ? "Add Questioning ..." : "Add Question"}
          </button>
        </div>
      <div className="flex flex-col gap-2 p-2 bg-white rounded-xl 2xl:w-full md:w-full sm:w-full lg:w-full xl:w-full">
        <div>
          <img src="image.png" alt="" className="w-full rounded-md shadow-lg" />
        </div>
        {/* image information */}
        <div>
          <div className="flex flex-col bg-[#f0f2f5] p-3 gap-2 rounded-md shadow-lg">
            <div className="flex items-center justify-start gap-3 ">
              <img src="excel.png" alt="" />
              <div>
                <h1>PAPAssessmentTemplate</h1>
                <p className="text-xs text-gray-500">
                  14 MB,Microsoft Excel Workout
                </p>
              </div>
            </div>
            <hr className="w-full " />
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/PAPAssessmentTemplate.xlsx";
                link.download = "PAPAssessmentTemplate.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-white w-full p-3 text-black rounded-md flex items-center justify-center gap-2 shadow-sm text-lg font-semibold"
            >
              <GoDownload /> <span>Download</span>
            </button>
          </div>
        </div>
      </div>
      </form>
      <div className="flex items-center justify-between px-10">
        {" "}
        <p className="text-white">-</p>
        <p className="xl:px-10 text-end">
          *Download the template, fill in the questions, and upload it.
        </p>
      </div>
    </div>
  );
};

export default AddQuestions;
