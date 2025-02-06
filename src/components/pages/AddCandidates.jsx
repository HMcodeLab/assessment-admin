import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";

const AddCandidates = () => {
  const [excelData, setExcelData] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const fileInputRef = useRef(null);
  const adminToken = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [errorCount, setErrorCount] = useState(false);

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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const validateData = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const invalidEntries = data.filter((row) => {
      return (
        !emailRegex.test(row.email) || !phoneRegex.test(row.phone_number)
      );
    });

    if (invalidEntries.length > 0) {
      toast.error("Some entries have invalid email or phone number format.");
      setExcelData(invalidEntries); // Set only invalid data to show in the table
      setErrorCount(true);
      return false; // Indicate that validation failed
    }

    setErrorCount(false);
    return true; // Validation successful
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid Excel file (.xls or .xlsx)");
        return;
      }

      setExcelFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Validate the data before setting it
        if (validateData(data)) {
          setExcelData(data);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleClear = () => {
    setExcelFile(null);
    setExcelData([]);
    setErrorCount(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedModule) {
      toast.error("Please select a module");
      setLoading(false);
      return;
    }
    if (!excelFile) {
      toast.error("Please upload an Excel file.");
      setLoading(false);
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
        }
      );

      if (response.status === 201) {
        toast.success("File uploaded successfully");

        const results = response.data?.results || [];
        console.log("API Results:", results);

        const rowToEmailMap = {};
        results.forEach((result) => {
          if (result.success && result.data?.email) {
            rowToEmailMap[result.row] = result.data.email;
          }
        });

        const unsuccessfulData = results
          .filter((result) => result.success === false)
          .map((result) => {
            const rowNum = result.row;
            const matchingCandidate = excelData[rowNum - 2];
            return {
              "SNO.": rowNum,
              email: 
                 matchingCandidate.email,
                
              name: 
                 matchingCandidate.name,
               
              phone:
                 matchingCandidate.phone_number,
              
              college: 
                 matchingCandidate.college_name,
              
              yearOfPassing: 
                 matchingCandidate.year_of_passing
              
            };
          });

        setErrorCount(unsuccessfulData.length > 0);
        setExcelData(unsuccessfulData);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error uploading file.";
      console.error("Upload error:", error.response?.data || error.message);
      
    } finally {
      setLoading(false);
    }
  };

  if (loader) {
    return <Loader />;
  }


  return (
    <div className="p-5 overflow-hidden">
      <Toaster position="top-center" />
      <div className="flex items-center justify-center gap-5  md:flex-col lg:flex-row ">
        <div className="flex flex-col gap-4 p-10 bg-white rounded-xl 2xl:w-full md:w-full sm:w-full lg:w-full xl:w-full shadow-md relative">
          <label htmlFor="module" className="whitespace-nowrap font-semibold">
            Select An Assesment
          </label>
          <select
            name="module"
            id="module"
            value={selectedModule}
            onChange={handleChange}
            className="px-4 py-2 w-full rounded-md border-2 border-gray-400 focus:outline-none placeholder-gray-400"
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
            className="border p-3 rounded-lg"
            ref={fileInputRef}
          />
          {excelFile && (
            <button
              onClick={handleClear}
              className="text-red-500 text-2xl absolute bottom-[6.5rem] right-2"
              title="clear file"
            >
              X
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading ? true : false}
            className="w-[40%] mx-auto rounded-lg p-2 px-4 bg-green-400 hover:bg-green-500 text-white hover:font-semibold"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </div>
        <div className="flex flex-col gap-2 p-2 bg-white rounded-xl 2xl:w-full md:w-full sm:w-full lg:w-full xl:w-full">
          <div>
            <img
              src="studentForm.png"
              alt=""
              className="w-full rounded-md shadow-lg"
            />
          </div>
          {/* image information */}
          <div>
            <div className="flex flex-col bg-[#f0f2f5] p-3 gap-2 rounded-md shadow-lg">
              <div className="flex items-center justify-start gap-3 ">
                <img src="excel.png" alt="" />
                <div>
                  <h1>Formate To Add Candidates</h1>
                  <p className="text-xs text-gray-500">
                    14 MB,Microsoft Excel Workout
                  </p>
                </div>
              </div>
              <hr className="w-full " />
              <button className="bg-white w-full p-3 text-black rounded-md"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/CandidatesForAssessment.xlsx";
                  link.download = "CandidatesForAssessment.xlsx";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-10">
        {" "}
        <p className="text-white">-</p>
        <p className="xl:px-10 text-end">
          *Download the template, fill in the questions, and upload it.
        </p>
      </div>

      <h1 className="text-center  my-4 text-2xl underline text-white font-semibold">
        All Candidates Details
      </h1>
      <div className={`overflow-x-auto`}>
        {excelData.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key} className="py-3 px-4 text-left font-semibold border-b">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`${errorCount ? "bg-red-500 text-white" : "bg-white"}`}>
              {excelData.map((row, index) => (
                <tr key={index} className={`${errorCount ? "hover:bg-green-700":"hover:bg-green-50 "} transition duration-150`}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="py-3 px-4 border-b">
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
