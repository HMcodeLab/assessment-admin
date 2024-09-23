import React, { useState, useEffect } from "react";
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
import { GoDownload } from "react-icons/go";

const AddQuestions = () => {
  const [Allmodules, setAllmodules] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(""); // For assessmentmoduleid
  const [loading, setloading] = useState(false);
  const [submodulearray, setsubmodulearray] = useState([]);
  const [selectedModule, setSelectedModule] = useState(""); // For moduleid
  const adminToken = localStorage.getItem("authToken");

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
    }
  };

  useEffect(() => {
    fetchData();
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
      toast.error("Please select an assessment, a module, and a file to upload.");
      setloading(false);
      return;
    }
  
    // Check if the uploaded file is an Excel file
    const allowedFileTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
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
    }finally{
      setloading(false);
    }
  };
  

  return (
    <div className="p-5">
      <Toaster/>
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col items-center gap-3 mb-5">
      <a
          href="/PAPAssessmentTemplate.xlsx"
          download
          className=" bg-gray-400  flex flex-row gap-2 items-center justify-center py-2 shadow-sm rounded-lg text-lg font-semibold w-[14vw]"
        >
          <GoDownload /> <span>Format</span>
        </a>
        <div className="flex flex-col border-2 justify-center px-4 py-2 gap-2 ">
          <label htmlFor="module" className="whitespace-nowrap font-semibold">
            Select Assessment:
          </label>
          <select
            name="module"
            id="module"
            value={selectedAssessment}
            onChange={handleAssessmentChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
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

          <label htmlFor="submodule" className="whitespace-nowrap font-semibold">
            Select Submodule (Module):
          </label>
          <select
            name="submodule"
            id="submodule"
            value={selectedModule}
            onChange={handleSubmoduleChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="" disabled>
              Select a submodule
            </option>
            {submodulearray?.map((submodule) => (
              <option key={submodule._id} value={submodule._id}>
                {submodule.moduleName}
              </option>
            ))}
          </select>

          <label htmlFor="fileUpload" className="whitespace-nowrap font-semibold">
            Choose File:
          </label>
          <input
            // onChange={handleFileChange}
            type="file"
            id="fileUpload"
            accept=".xls,.xlsx"
            className="p-2 rounded border border-gray-300"
          />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {loading ? "Submiting ...":"Submit"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestions;
