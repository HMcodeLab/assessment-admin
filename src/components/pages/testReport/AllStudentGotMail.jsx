import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { FaEyeSlash, FaEye, FaTrash, FaStopwatch } from "react-icons/fa";
import tag from "../../../Assets/Tag.png";
import BarChart from "./components/graphs/BarGraph";
import * as XLSX from "xlsx"; // Import xlsx library
import filteredIcon from "../../../Assets/arrow.png";
import { MdMoreVert } from "react-icons/md";
import Loader from "../../Loader";

const AllStudentGotMail = () => {
  const { testId } = useParams();
  const location = useLocation();
  const { assessmentName } = location.state;
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allStudent, setAllStudent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const adminToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [restartloading, setRestartloading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingStates, setLoadingStates] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [toggleOpen, setToggleOpen] = useState(null);
  const dropdownRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAssessmentSentToCandidatesDetails?moduleAssessmentid=${testId}`,
        {
          headers: {
            Authorization: "Bearer " + adminToken,
          },
        }
      );
      if (response && response.data) {
        setAllStudent(response.data.data);
        
      }
    } catch (error) {
      toast.error("Error in fetching All student details");
    } finally {
      setLoading(false);
    }
  };

  let temp = true;
  useEffect(() => {
    // Fetch data immediately on mount
    if (temp) {
      fetchData();
      temp = false;
    }

    if (autoRefresh) {
      // Set up the interval for refreshing data
      const interval = setInterval(() => {
        fetchData();
      }, 15000); // Set to 15000ms (15 seconds)

      // Cleanup the interval when the component unmounts or autoRefresh changes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, testId, adminToken]);

  // middle screen
  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filterByStatus = (student) => {
    if (selectedStatus === "All") return true;
    if (selectedStatus === "Suspended") return student?.isSuspended;
    if (selectedStatus === "Ongoing")
      return !student?.isSuspended && !student?.isAssessmentCompleted;
    if (selectedStatus === "Completed Successfully")
      return student?.isAssessmentCompleted && !student?.isSuspended;
    return true;
  };

  const filterBySearch = (student) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(lowerCaseSearchQuery) ||
      student.email.toLowerCase().includes(lowerCaseSearchQuery)
    );
  };

  // Format date for dropdown display and comparison
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    return `${day}-${month}-${year}`;
  };

  // Filter feedbacks by the selected date
  const filteredByDate = (student) =>
    selectedDate === "" || formatDate(student.updatedAt) === selectedDate;

  const filteredStudents = allStudent
    .filter(filterByStatus)
    .filter(filterBySearch)
    .filter(filteredByDate);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents?.map((student) => ({
        Name: student?.name,
        Email: student?.email,
        Contact: student?.phone_number?.toString(),
        College: student?.college_name,
        "Year of Passing": student?.year_of_passing,
        Link: student?.assessmentUrl,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Details");
    XLSX.writeFile(workbook, `${assessmentName}.xlsx`);
  };

  return (
    <div className="flex flex-col justify-center mx-4 my-4">
      <Toaster />
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <img src={tag} alt="Tag" />
          Student Details
        </h2>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={exportToExcel}
        >
          Download
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border-2 border-blue-400 ">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr className="xl:table-row">
              <th className="px-4 py-2 text-left">SNo.</th>
              <th className="text-sm font-semibold px-2 py-3 text-left cursor-pointer">
                Name
              </th>
              <th className="px-4 py-2 text-left">Test Date</th>
              <th className="px-4 py-2 text-left">Email ID</th>
              <th className="px-4 py-2 text-left">Contact No</th>
              <th className="px-4 py-2 text-left">Link</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, index) => (
              <React.Fragment key={index}>
                {/* Row for XL screens */}
                <tr
                  className={` xl:table-row border-2 ${
                    student?.isSuspended && "bg-red-400"
                  } ${student?.isAssessmentCompleted && "bg-green-400"}`}
                >
                  <td className=" px-4 py-2">{index + 1}</td>
                  <td className=" px-4 py-2">{student?.name}</td>
                  <td className=" px-4 py-2 text-nowrap">
                    {formatDate(student?.updatedAt)}
                  </td>
                  <td className=" px-4 py-2">{student?.email}</td>
                  <td className=" px-4 py-2">{student?.phone_number}</td>
                  <td className=" px-4 py-2">
                    {student?.assessmentUrl || "N/A"}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudentGotMail;
