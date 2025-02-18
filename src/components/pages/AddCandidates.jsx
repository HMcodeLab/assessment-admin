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
  const [singleCandidate, setSingleCandidate] = useState(false);
  const [studentStatus, setStudentStatus] = useState([]);
  const initialData = {
    moduleAssessmentid: "",
    email: "",
    name: "",
    phone_number: "",
    college_name: "",
    year_of_passing: "",
  };

  const [formData, setFormData] = useState(initialData);
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
  let temp = true;
  useEffect(() => {
    if (temp) {
      fetchData();
      temp = false;
    }
  }, []);

  const handleChange = (event) => {
    setSelectedModule(event.target.value);
    let temp = true;
    if (singleCandidate) {
      setFormData({
        ...formData,
        ["moduleAssessmentid"]: event.target.value,
      });
    }
    if (temp) {
      handleClear();
      temp = false;
    }
  };

  const validateData = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const invalidEntries = data.filter((row) => {
      return !emailRegex.test(row.email) || !phoneRegex.test(row.phone_number);
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

  const handleChangeCandidateType = () => {
    setSingleCandidate(!singleCandidate);
  };

  const handleChangeCandidate = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

        const dataReport = results
          .filter((result) => result.success)
          .map((result) => {
            // const rowNum = result.row;
            const matchingCandidate = result.data;
            return {
              successStatus: result.success ? "Success" : "Failed",
              email: matchingCandidate
                ? matchingCandidate.email
                : "Email not found",
              name: matchingCandidate
                ? matchingCandidate.name
                : "Name not found",
              phone: matchingCandidate
                ? matchingCandidate.phone_number
                : "Phone not found",
            };
          });
        setStudentStatus(dataReport);
        // console.log("Data Report:", dataReport);
        // console.log("Error:", excelData);

        const unsuccessfulData = excelData.map((result) => {
          const matchingCandidate = result;
          return {
            // "SNO.": rowNum,
            email: matchingCandidate
              ? matchingCandidate.email
              : "Email not found",
            name: matchingCandidate ? matchingCandidate.name : "Name not found",
            phone: matchingCandidate
              ? matchingCandidate.phone_number
              : "Phone not found",
            college: matchingCandidate
              ? matchingCandidate.college_name
              : "College not found",
            yearOfPassing: matchingCandidate
              ? matchingCandidate.year_of_passing
              : "Year not found",
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      // handleClear();
    }
  };

  const handleSubmitSingleCandidate = async () => {
    setLoading(true);
    if (!selectedModule) {
      toast.error("Please select a module");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/addSingleCandidateForAssessment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
  
      if (response.status === 201) {
        toast.success("Candidate uploaded successfully");
        setFormData(initialData);
        setSelectedModule("");
        setSingleCandidate(false);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error uploading candidate.";
      console.error("Upload error:", error.response?.data || error.message);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      studentStatus?.map((student) => ({
        Name: student?.name,
        Email: student?.email,
        Contact: student?.phone?.toString(),
        Status: student?.successStatus,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentGotMail");
    XLSX.writeFile(workbook, `${selectedModule}(StudentGotMail).xlsx`);
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="p-5 overflow-hidden">
      <Toaster position="top-center" />
      <div className="flex items-center justify-center gap-5  md:flex-col lg:flex-row ">
        <div className="flex flex-col gap-4 p-10 bg-white rounded-xl w-full shadow-md relative">
          <div className="flex items-center space-x-4">
            <label className="font-semibold">Single Candidate:</label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="singleCandidate"
                value="yes"
                checked={singleCandidate === true}
                onChange={handleChangeCandidateType}
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="singleCandidate"
                value="no"
                checked={singleCandidate === false}
                onChange={handleChangeCandidateType}
              />
              <span>No</span>
            </label>
          </div>
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

          {!singleCandidate ? (
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="border p-3 rounded-lg"
              ref={fileInputRef}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="mb-4">
                <label className=" font-semibold text-gray-700">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeCandidate}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className=" font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChangeCandidate}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className=" font-semibold text-gray-700">Mobile</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChangeCandidate}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className=" font-semibold text-gray-700">
                  College Name
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChangeCandidate}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className=" font-semibold text-gray-700">
                  Passing Year
                </label>
                <input
                  type="number"
                  name="year_of_passing"
                  value={formData.year_of_passing}
                  onChange={handleChangeCandidate}
                  className="border p-2 w-full"
                />
              </div>
            </div>
          )}
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
            onClick={
              singleCandidate ? handleSubmitSingleCandidate : handleSubmit
            }
            disabled={loading ? true : false}
            className="w-[40%] mx-auto rounded-lg p-2 px-4 bg-green-400 hover:bg-green-500 text-white hover:font-semibold"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </div>
        <div className="flex flex-col gap-2 p-2 bg-white rounded-xl w-full">
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
              <button
                className="bg-white w-full p-3 text-black rounded-md"
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
      {studentStatus?.length>0 && (
        <button className="bg-green-500 px-4 py-2 my-2 text-xl font-semibold text-white" onClick={exportToExcel} >Download Mail Report</button>
      )}
      <div className={`overflow-x-auto`}>
        {excelData.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th
                    key={key}
                    className="py-3 px-4 text-left font-semibold border-b"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`${errorCount ? "bg-green-500 text-white" : "bg-white"}`}
            >
              {excelData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    errorCount ? "hover:bg-red-700" : "hover:bg-green-50 "
                  } transition duration-150`}
                >
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
          !singleCandidate && (
            <div className="text-gray-600">No data uploaded yet.</div>
          )
        )}
      </div>
    </div>
  );
};

export default AddCandidates;
