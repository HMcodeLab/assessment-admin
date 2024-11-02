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
  const [loading, setloading] = useState(false);
  const [loader, setloader] = useState(true);
  const [errorCount, seterrorCount] = useState(false)

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
    seterrorCount(false);
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
        }
      );

      if (response.status === 201) {
        toast.success("File uploaded successfully");

        const results = response.data?.results || [];
        console.log("API Results:", results);

        // Create a map of row numbers to emails for successful candidates
        const rowToEmailMap = {};
        results.forEach((result) => {
          if (result.success && result.data?.email) {
            rowToEmailMap[result.row] = result.data.email;
          }
        });

        // Filter unsuccessful entries and add matched emails from rowToEmailMap
        const unsuccessfulData = results
          .filter((result) => result.success === false)
          .map((result) => {
            const rowNum = result.row;

            const matchingCandidate = excelData[rowNum - 2]; // Assuming row numbers start from 1

            // Extract data from the matching candidate, if found
            return {
              "SNO.": rowNum,
              email: matchingCandidate
                ? matchingCandidate.email
                : "Email not found", // Get email from excelData
              name: matchingCandidate
                ? matchingCandidate.name
                : "Name not found", // Get name from excelData
              phone: matchingCandidate
                ? matchingCandidate.phone_number
                : "Phone not found", // Get phone from excelData
              college: matchingCandidate
                ? matchingCandidate.college_name
                : "College not found", // Get college from excelData
              yearOfPassing: matchingCandidate
                ? matchingCandidate.year_of_passing
                : "Year not found", // Get year from excelData
            };
          });

unsuccessfulData ? seterrorCount(true) : seterrorCount(false)

        // Set unsuccessful data to the table display
        setExcelData(unsuccessfulData);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error uploading file.";
      console.error("Upload error:", error.response?.data || error.message);
      toast.error(errorMessage);
    } finally {
      setloading(false);
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
              src="image.png"
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
            <tbody className={`${errorCount ? "bg-red-500 text-white" :""}`}>
              {excelData.map((row, index) => (
                <tr key={index} className="hover:bg-green-50 transition duration-150">
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
