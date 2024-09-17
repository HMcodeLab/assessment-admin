import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";

const Assessment = () => {
  const [excelData, setExcelData] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [testData, setTestData] = useState([]);
  const fileInputRef = useRef(null);
  const adminToken = localStorage.getItem("authToken");

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
        const modules = response.data.data.map((module) => ({
          name: module.assessmentName,
          id: module._id,
        }));
        setModules(modules);
        // console.log(response.data.data);
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // console.log(modules);

  const handleChange = (event) => {
    setSelectedModule(event.target.value); // Update state with selected value
  };

  const fetchTestData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/addCandidatesForAssessment`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Admin ${adminToken}`,
          },
        }
      );
      setTestData(response?.data.data);
    } catch (error) {
      console.error(
        "Error fetching test details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      // Check if the file type is valid
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid Excel file (.xls or .xlsx)");
        return;
        // handleClear();
      }

      // console.log(file.type);
      setExcelFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        setExcelData(data);
      };

      reader.readAsBinaryString(file);
    }
  };

  // console.log(excelFile);

  const handleClear = () => {
    setExcelFile(null);
    setExcelData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadToAPI = async () => {
    if (!excelFile) {
      toast.error("Please upload an Excel file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("candidates", excelFile); // Append the file itself
      formData.append("moduleAssessmentid", selectedModule); // Add other data if needed

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/addCandidatesForAssessment`,
        formData, // Send the form data with the file
        {
          headers: {
            Authorization: `Admin ${adminToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("File uploaded successfully!");
        handleClear();
        fetchTestData(); // Fetch test data after successful upload
      } else {
        toast.error("Error uploading file.");
      }
    } catch (error) {
      toast.error("Error uploading file.");
      console.error(
        "Upload error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDownloadExcel = () => {
    const url = "/CandidatesForAssessment.xlsx";
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-data.xlsx";
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-gray-600 p-5">
      <Toaster position="top-center" />
      <div className="h-[10vh] w-full flex items-center justify-between mt-3 px-10 border rounded-lg shadow-2xl">
        <div className="text-2xl font-semibold text-white">
          Upload Your Excel
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="border p-3 rounded-lg text-white"
            ref={fileInputRef}
          />

          <select
            name="module"
            id="module"
            value={selectedModule}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a module
            </option>{" "}
            {/* Default option */}
            {modules.map((module) => (
              <option value={module.id} key={module.id}>
                {module.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="h-[6vh] rounded-lg p-2 px-4 bg-red-400 hover:bg-red-500"
          >
            Clear
          </button>
          <button
            onClick={handleUploadToAPI}
            className="h-[6vh] rounded-lg p-2 px-4 bg-green-400 hover:bg-green-500"
          >
            Upload Excel
          </button>
          <button
            onClick={handleDownloadExcel}
            className="h-[6vh] rounded-lg p-2 px-4 bg-blue-400 hover:bg-blue-500"
          >
            Download Excel
          </button>
        </div>
      </div>

      <div className="mt-10 bg-white p-5 rounded-lg">
        {excelData.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key} className="border px-4 py-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border px-4 py-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-600">No data uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
