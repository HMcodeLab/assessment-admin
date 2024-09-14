import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";

const Assessment = () => {
  const [excelData, setExcelData] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [testData, setTestData] = useState([]);
  const fileInputRef = useRef(null);
  const adminToken = localStorage.getItem("authToken");

  // Function to fetch test data
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
console.log(excelFile);

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
      formData.append("moduleAssessmentid", "66d93cc4d898158086e281c2"); // Add other data if needed
  
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
