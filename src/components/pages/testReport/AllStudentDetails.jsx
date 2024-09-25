import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaChevronRight } from "react-icons/fa";
import tag from "../../../Assets/Tag.png";
import BarChart from "./components/graphs/BarGraph";
import { ImSpinner9 } from "react-icons/im";
import * as XLSX from "xlsx"; // Import xlsx library

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
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    restart: false,
  });

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
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner9 className="animate-spin text-3xl text-green-600" />
      </div>
    );
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

  const filteredStudents = allStudent
    .filter(filterByStatus)
    .filter(filterBySearch);

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
      allStudent.map((student) => ({
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
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleRestartClick = async (email) => {
    setLoadingStates((prev) => ({ ...prev, restart: true }));
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
      setLoadingStates((prev) => ({ ...prev, restart: false }));
    }
  };

  return (
    <div className="flex flex-col justify-center mx-4 my-4">
      <Toaster/>
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
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border-2 border-blue-400">
        <div className="flex flex-row justify-between items-center px-2">
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
            <tr>
              <th className="px-4 py-2 text-left">SNo.</th>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Email ID</th>
              <th className="px-4 py-2 text-left">Contact No</th>
              <th className="px-4 py-2 text-left">College</th>
              <th className="px-4 py-2 text-left">Passed Out</th>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={index}
                className={`${student?.isSuspended && "bg-red-400"} ${
                  student?.isAssessmentCompleted && "bg-green-400"
                }`}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{student?.name}</td>
                <td className="border px-4 py-2">{student?.email}</td>
                <td className="border px-4 py-2">{student?.phone_number}</td>
                <td className="border px-4 py-2">{student?.college_name}</td>
                <td className="border px-4 py-2">{student?.year_of_passing}</td>
                <td className="border px-4 py-2">{student?.rank}</td>
                <td className="border px-4 py-2">{getStatus(student)}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleView(student.email)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteClick(student?.email)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRestartClick(student?.email)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    {restartloading ? "Restarting ..." : "Restart"}
                  </button>
                </td>
              </tr>
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
      <div className="mt-8">
        <div className="flex items-center mb-2">
          <img
            src={tag}
            alt="Tag Icon"
            className="w-[22.62px] h-[22.62px] mr-2"
          />
          <h2 className="text-lg font-bold text-black">Rank</h2>
        </div>
        <hr className="border-gray-300 mb-4" />
        <BarChart rankCount={rankCounts} />
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
