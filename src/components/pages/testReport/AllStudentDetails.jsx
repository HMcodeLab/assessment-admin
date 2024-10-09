import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEyeSlash,FaEye,FaTrash,FaStopwatch } from "react-icons/fa";
import tag from "../../../Assets/Tag.png";
import BarChart from "./components/graphs/BarGraph";
import * as XLSX from "xlsx"; // Import xlsx library
import filteredIcon from "../../../Assets/arrow.png";
import { MdMoreVert } from "react-icons/md";
import Loader from "../../Loader";

const AllStudentDetails = () => {
  const { testId } = useParams();
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
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    restart: false,
  });

  const [toggleOpen, setToggleOpen] = useState(null);
  const dropdownRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsersResultForAssessment/${testId}`,
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

  useEffect(() => {
    // Fetch data immediately on mount
    fetchData();

    // Set up the interval for refreshing data
    const interval = setInterval(() => {
      fetchData();
    }, 15000); // Set to 5000ms (5 seconds)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [testId, adminToken]);

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      // If the same column is clicked, toggle the sort order
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // If a new column is clicked, set that as the column and default to ascending
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortStudents = (students) => {
    return students.sort((a, b) => {
      let compareA, compareB;
      if (sortColumn === "name") {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      } else if (sortColumn === "email") {
        compareA = a.email.toLowerCase();
        compareB = b.email.toLowerCase();
      } else if (sortColumn === "marks") {
        compareA = a.totalMarks;
        compareB = b.totalMarks;
      } else {
        return 0; // If no sorting column, return as-is
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const filteredStudents = allStudent
    .filter(filterByStatus)
    .filter(filterBySearch);

  const sortedStudents = sortStudents(filteredStudents);

  const handleView = (studentId) => {
    navigate(`/student-test-report/${testId}/${studentId}`);
  };

  const countStudentsByRank = (studentsData) => {
    return studentsData.reduce((acc, student) => {
      acc[student.rank] = (acc[student.rank] || 0) + 1;
      return acc;
    }, {});
  };

  const rankCounts = countStudentsByRank(allStudent);

  const getStatus = (student) => {
    if (student?.isSuspended) return "Suspended";
    if (student?.isAssessmentCompleted) return "Completed Successfully";
    return "Ongoing";
  };

  

  function calculateTimeDifference(createdAt, updatedAt) {
    const startTime = new Date(createdAt);
    const endTime = new Date(updatedAt);
    const timeDifference = endTime - startTime;
    const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    const seconds = timeDifferenceInSeconds % 60;

    return `${minutes} min , ${seconds} sec`;
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents?.map((student) => ({
        Name: student?.name,
        Email: student?.email,
        Contact: student?.phone_number,
        College: student?.college_name,
        "Year of Passing": student?.year_of_passing,
        marks: student?.totalMarks,
        Rank: student?.rank,
        time: calculateTimeDifference(student?.createdAt, student?.updatedAt),
        Status: getStatus(student),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Details");
    XLSX.writeFile(workbook, `student_details_${testId}.xlsx`);
  };

  const handleDeleteClick = (email) => {
    setSelectedStudent(email);
    setShowModal(true);
  };

  // Confirm deletion and remove from state without reloading
  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    setLoadingStates((prev) => ({ ...prev, delete: true }));
    setShowModal(false);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_DOMAIN}/deleteUserReport`,
        {
          data: {
            moduleAssessmentid: testId,
            email: selectedStudent,
          },
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response) {
        toast.success("Student Report Deleted Successfully");

        // Remove the deleted student from the state
        setAllStudent((prevStudents) =>
          prevStudents.filter((student) => student.email !== selectedStudent)
        );
      }
    } catch (error) {
      toast.error("Error in Deleting student Report");
    } finally {
      setDeleteLoading(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedStudent(null);
    setShowModal(false);
  };

  const AlertModal = ({ showModal, onClose, onConfirm }) => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Toaster />
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this report? This action cannot be
            undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleRestartClick = async (email) => {
    setLoadingStates((prev) => ({ ...prev, restart: true }));
    setRestartloading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/restartAssessment`,
        { moduleAssessmentid: testId, email: email },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (response) {
        toast.success("Assessment Restarted Successfully");
        // Remove the deleted student from the state
        fetchData();
      }
    } catch (error) {
      toast.error("Error in Restarting Assessment");
      console.error("Restart Error:", error);
    } finally {
      setRestartloading(false);
      setLoadingStates((prev) => ({ ...prev, restart: false }));
    }
  };

  const handleToggle = (studentId) => {
    setToggleOpen(toggleOpen === studentId ? null : studentId); // Toggle the specific student's dropdown
  };

  const handleAction = (action, student) => {
    // Perform the action (e.g., View, Delete, Resume)
    console.log(`Performing action: ${action} for student: ${student.name}`);

    // Automatically close the dropdown after action is taken
    setToggleOpen(null);
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
        <div className="flex flex-row justify-between items-center px-2 ">
          <div className="p-4">
            <label htmlFor="statusFilter">Filter by Status: </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-blue-500 p-2 rounded-lg"
            >
              <option value="All">All</option>
              <option value="Suspended">Suspended</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed Successfully">
                Completed Successfully
              </option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Students"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-3 rounded-lg w-[20vw]"
            />
          </div>
        </div>

        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr className="md:hidden xl:table-row ">
              <th className="px-4 py-2 text-left">SNo.</th>
              <th className="text-sm font-semibold px-2 py-3 text-left cursor-pointer">
                Name{" "}
                <img
                  src={filteredIcon}
                  alt="Filter"
                  onClick={() => handleSort("name")}
                  className="inline-block w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-4 py-2 text-left">Email ID</th>
              <th className="px-4 py-2 text-left">Contact No</th>
              <th className="px-4 py-2 text-left">College</th>
              <th className="px-4 py-2 text-left">Passed Out</th>
              <th className="px-4 py-2 text-left">Marks</th>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
            {/* Middle  Screen */}
            <tr className="xl:hidden md:table-row">
              <th className="px-4 py-2 text-left font-medium">SNO.</th>
              <th className="px-4 py-2 text-left font-medium">
                Name , Email , Phone
              </th>
              <th className="px-4 py-2 text-left font-medium">
                College (year)
              </th>
              <th className="px-4 py-2 text-left font-medium">Rank</th>
              <th className="px-4 py-2 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-y-hidden ">
            {filteredStudents.map((student, index) => (
              <>
                <tr
                  key={index}
                  className={`md:hidden xl:table-row ${
                    student?.isSuspended && "bg-red-400"
                  } ${student?.isAssessmentCompleted && "bg-green-400"}`}
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{student?.name}</td>
                  <td className="border px-4 py-2">{student?.email}</td>
                  <td className="border px-4 py-2">{student?.phone_number}</td>
                  <td className="border px-4 py-2">{student?.college_name}</td>
                  <td className="border px-4 py-2">
                    {student?.year_of_passing}
                  </td>
                  <td className="border px-4 py-2">{student?.totalMarks}</td>
                  <td className="border px-4 py-2">{student?.rank}</td>
                  <td className="border px-4 py-2">{getStatus(student)}</td>
                  <td className="border px-4 py-2 flex ">
                    <button
                      disabled={
                        student?.isSuspended || student?.isAssessmentCompleted
                          ? false
                          : true
                      }
                      onClick={() => handleView(student.email)}
                      className={` ${
                        student.isSuspended || student.isAssessmentCompleted
                          ? " hover:bg-blue-700 bg-blue-500"
                          : "bg-blue-200"
                      }  text-white font-bold py-2 px-4 rounded ml-2`}
                    >
                      V
                    </button>
                    <button
                      onClick={() => handleDeleteClick(student?.email)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                      D
                    </button>

                    <button
                      disabled={
                        student?.isSuspended || student?.isAssessmentCompleted
                          ? false
                          : true
                      }
                      onClick={() => handleRestartClick(student?.email)}
                      className={` ${
                        student.isSuspended || student.isAssessmentCompleted
                          ? " hover:bg-yellow-700 bg-yellow-500"
                          : "bg-yellow-200"
                      }  text-white font-bold py-2 px-4 rounded ml-2`}
                    >
                      {restartloading && loadingStates ? "Resuming ..." : "Resume"}
                    </button>
                  </td>
                </tr>
                <tr
                  key={index}
                  className={`xl:hidden z-20 xl:overflow-y-hidden md:overflow-hidden md:table-row font-normal text-sm ${
                    student?.isSuspended && "bg-red-400"
                  } ${student?.isAssessmentCompleted && "bg-green-400"}`}
                >
                  <td className="text-start px-6 font-normal">{index + 1}</td>
                  <td className="flex flex-col text-start font-normal">
                    <span>{student?.name}</span>
                    <span>{student?.email}</span>
                    <span>{student?.phone_number}</span>
                  </td>
                  <td className="px-4 py-2 text-left font-normal">
                    {student?.college_name + ` (${student?.year_of_passing})`}
                  </td>
                  <td className="px-8 py-2 text-left font-normal">
                    {student?.rank}
                  </td>
                  <td
                    className="px-6 py-2 text-center font-normal cursor-pointer relative"
                    onClick={() => handleToggle(student.email)}
                  >
                    <MdMoreVert />
                    {toggleOpen === student.email && (
                      <ul className="absolute bg-white shadow-lg py-2 rounded-lg right-0 mt-1 text-sm">
                        <li
                          className="cursor-pointer px-2 py-1 rounded-md hover:bg-green-300"
                          onClick={() => handleView(student.email)}
                        >
                          View
                        </li>
                        <li
                          className="cursor-pointer px-2 py-1 rounded-md hover:bg-green-300"
                          onClick={() => handleDeleteClick(student.email)}
                        >
                          Delete
                        </li>
                        <li
                          className="cursor-pointer px-2 py-1 rounded-md hover:bg-green-300"
                          onClick={() => handleRestartClick(student.email)}
                        >
                          Resume
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display the student count based on filter */}
      <div className="p-4">
        <p className="font-semibold">
          {`${filteredStudents.length}/${allStudent.length} students : ${selectedStatus}`}
        </p>
      </div>

      {/* Rank Chart */}
      <div className="mt-10 mb-6">
        <div className="flex items-center mb-2">
          <img
            src={tag}
            alt="Tag Icon"
            className="w-[22.62px] h-[22.62px] mr-2"
          />
          <h2 className="text-lg font-bold text-black">Rank</h2>
        </div>
        <hr className="border-gray-300 mb-4" />
        <BarChart
          rankCount={rankCounts}
          lowestRank={allStudent[allStudent.length - 1]?.rank}
        />
      </div>

      <AlertModal
        showModal={showModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AllStudentDetails;
