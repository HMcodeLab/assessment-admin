import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";


const AddCandidates = () => {
  const [excelData, setExcelData] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const fileInputRef = useRef(null);
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);

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
  let temp=true
  useEffect(() => {
    if(temp){
      fetchData();
      temp=false
    }
  }, []);

  // console.log(modules);

  const handleChange = (event) => {
    setSelectedModule(event.target.value); // Update state with selected value
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

  const handleSubmit = async () => {
    setloading(true);
    if (!selectedModule) {
      toast.error("Please select a module");
      setloading(false);
      return;
    }
    if (!excelFile) {
      toast.error("Please upload an Excel file.");
      setloading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("candidates", excelFile);
      formData.append("moduleAssessmentid", selectedModule);
  
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/addCandidatesForAssessment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        }
      );
  
      if (response.status === 201) {
        toast.success("File uploaded successfully");
  
        // Check the response structure and loop through the 'results' array
        const results = response.data?.results || [];
  
        results.forEach(result => {
          const { success, message, data } = result;
          const { email, name } = data;
          if (success) {
            console.log(`${name} ${email} successfully received the mail`);
          } else {
            console.log(`${name} ${email} was unsuccessful in receiving the mail`);
          }
        });
  
        handleClear();
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error uploading file.";
      toast.error(errorMessage);
      console.error("Upload error:", error.response ? error.response.data : error.message);
    } finally {
      setloading(false);
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
    <div className="h-auto w-full bg-gray-600 p-5">
      <Toaster position="top-center" />
      {/* <TimeConversionExample/> */}
      <div className="w-full xl:w-[30%] xl:mx-auto flex flex-col items-center justify-between mt-3 px-10 border rounded-lg shadow-2xl">
        <div className=" flex items-center py-4 gap-4">
          <p className="text-2xl font-semibold text-white">Add Candidates</p>
          <button
            onClick={handleDownloadExcel}
            className="rounded-lg p-2 px-4 bg-blue-400 hover:bg-blue-500 text-white"
          >
            Format
          </button>
        </div>
        <div className="relative flex flex-col justify-center items-center gap-4 py-4">
          <select
            name="module"
            id="module"
            value={selectedModule}
            onChange={handleChange}
            className="px-12 py-2 w-[320px] rounded-lg focus:outline-none"
          >
            <option value="" disabled>
              Select an Assessment
            </option>{" "}
            {/* Default option */}
            {modules.map((module) => (
              <option value={module.id} key={module.id}>
                {module.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="border p-3 rounded-lg text-white"
            ref={fileInputRef}
          />
          {excelFile && (
            <button
              onClick={handleClear}
              className="text-white text-2xl absolute mt-[0px] right-[-20px]"
              title="clear file"
            >
              X
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="w-[100%] rounded-lg p-2 px-4 bg-green-400 hover:bg-green-500 text-white hover:font-semibold"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </div>
      </div>

      <h1 className="text-center  my-4 text-2xl underline text-white font-semibold">
        All Candidates Details
      </h1>
      <div className="mt-10  w-full overflow-x-auto scroll-smooth bg-white p-5 rounded-lg">
        {excelData.length > 0 ? (
          <table className="w-full table-auto text-center">
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

export default AddCandidates;
