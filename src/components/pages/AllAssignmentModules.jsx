import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const AssignmentResult = () => {
  const [testData, setTestData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const adminToken = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState({});
  const navigate = useNavigate();
  const temp = true;

  useEffect(() => {
    setLoading(true);
    if (temp) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`,
          {
            headers: { Authorization: "Bearer " + adminToken },
          }
        )
        .then((response) => {
          setTestData(response?.data.data);
        })
        .catch((error) => {
          console.error("Error fetching test details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
  const fetchData = async (testId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsersResultForAssessment/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      // console.log(response?.data);  // Log the response for debugging
      if (response) {
        // setCheckStudents(response?.data);
        return response?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewClick = async (testId, assessmentName) => {
    setViewLoading((prev) => ({ ...prev, [testId]: true })); // Set loading for this specific testId
    try {
      const response = await fetchData(testId);
      const students = response?.data || [];
      if (students.length > 0) {
        navigate(`/test-report/${testId}`, { state: { assessmentName } });
      } else {
        toast.error("No Students are available");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.");
    } finally {
      setViewLoading((prev) => ({ ...prev, [testId]: false })); // Reset loading state for this testId
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = testData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(testData.length / rowsPerPage);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
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
    const month = monthNames[dateObj.getUTCMonth()];
    let hours = dateObj.getUTCHours();
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} ${hours}.${minutes}${ampm}`;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-5">
      <Toaster position="top-center" />
      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Assessment Name
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Total Module
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Max Marks
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Time Limit (mins)
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Proctoring
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Start Date
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Last Date
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((assessment, index) => (
            <tr
              key={index}
              className="hover:bg-green-50 transition duration-150"
            >
              <td className="py-3 px-4 border-b">{assessment.assessmentName}</td>
              <td className="py-3 px-4 border-b">
                {assessment?.Assessmentmodules?.length || 0}
              </td>
              <td className="py-3 px-4 border-b">{assessment.maxMarks}</td>
              <td className="py-3 px-4 border-b">{assessment.timelimit}</td>
              <td className="py-3 px-4 border-b">
                {[
                  assessment.ProctoringFor?.mic?.inUse && "Mic",
                  assessment.ProctoringFor?.webcam?.inUse && "Webcam",
                  assessment.ProctoringFor?.TabSwitch?.inUse && "TabSwitch",
                  assessment.ProctoringFor?.multiplePersonInFrame?.inUse &&
                    "MultiplePersonInFrame",
                  assessment.ProctoringFor?.PhoneinFrame?.inUse && "PhoneInFrame",
                  assessment.ProctoringFor?.SoundCaptured?.inUse && "SoundCaptured",
                  assessment.ProctoringFor?.ControlKeyPressed?.inUse &&
                    "ControlKeyPressed",
                  assessment.ProctoringFor?.invisiblecam?.inUse && "invisiblecam",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td className="py-3 px-4 border-b">
                {formatDate(assessment.startDate)}
              </td>
              <td className="py-3 px-4 border-b">
                {formatDate(assessment.lastDate)}
              </td>
              <td
                className="py-3 px-4 border-b cursor-pointer"
                onClick={() => handleViewClick(assessment._id, assessment.assessmentName)}
              >
                <span className="border border-yellow-500 px-4 py-2 rounded-md text-yellow-500 font-semibold hover:bg-yellow-500 hover:text-white">{viewLoading[assessment._id] ? "Viewing..." : "View"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<div className="flex justify-between">
      <div className="flex items-center mt-4">
        <span className="mr-2">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 "
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
          className="px-3 py-1 rounded bg-gray-200 text-gray-500 disabled:opacity-50"
        >
          {"<"}
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handleChangePage(index)}
            className={`px-3 py-1 rounded mx-1 ${
              page === index
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={page === totalPages - 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-500 disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
</div>
    </div>
  );
};

export default AssignmentResult;
