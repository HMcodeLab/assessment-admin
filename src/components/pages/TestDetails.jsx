import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { MdVisibilityOff } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import AllQuestions from "./AllQuestions";
// import { adminToken } from "../../api";

const TestDetails = () => {
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(true);
  const [testData, setTestData] = useState([]);
  const [enabledTests, setEnabledTests] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [testsPerPage,setTestsPerPage] = useState(5); // Number of tests per page
  const navigate = useNavigate();
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);

  let temp = true;
  useEffect(() => {
    if (temp && adminToken) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`,
          {
            headers: {
              Authorization: "Bearer " + adminToken,
            },
          }
        )
        .then((response) => {
          setTestData(response?.data.data);
          const initialEnabledTests = {};
          response?.data.data.forEach((test) => {
            initialEnabledTests[test._id] = test.isVisible;
          });
          setEnabledTests(initialEnabledTests);
        })
        .catch((error) => {
          console.error("Error fetching test details:", error);
        })
        .finally(() => {
          setloading(false); // Set loading to false when the request finishes
        });
      temp = false;
    }
  }, []);
  const totalPages = Math.ceil(testData.length / testsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setTestsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const handleToggle = (testId) => {
    const newVisibility = !enabledTests[testId];

    axios
      .put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/ChangeAssessmentVisiblity/${testId}`,
        { isVisible: newVisibility },
        {
          headers: {
            Authorization: "Bearer " + adminToken,
          },
        }
      )
      .then(() => {
        setEnabledTests((prev) => ({
          ...prev,
          [testId]: newVisibility,
        }));
        toast.success(
          `Assignment ${newVisibility ? "enabled" : "disabled"} successfully!`,
          {
            position: "top-center",
          }
        );
      })
      .catch((error) => {
        console.error("Error changing assessment visibility:", error);
        toast.error("Failed to change assignment visibility.", {
          position: "top-center",
        });
      });
  };

  const handleDeleteClick = (testId) => {
    setSelectedTestId(testId);
    setOpenDeleteDialog(true);
  };

  const handleViewQuestions = (testId) => {
    setSelectedTestId(testId);
    setQuestionsModalOpen(true);
  };

  function handleModalClose() {
    setQuestionsModalOpen(false);
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/deleteModuleAssessment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            moduleAssessmentid: selectedTestId, // replace this with the actual module assessment ID
          }),
        }
      );

      if (response.ok) {
        toast.success("Assessment module deleted successfully!");
        setTestData((prevTests) =>
          prevTests.filter((test) => test._id !== selectedTestId)
        );
      } else {
        toast.error("Failed to delete the assessment module.");
      }
    } catch (error) {
      console.error("Error deleting assessment module:", error);
      toast.error("An error occurred while deleting the assessment module.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedTestId(null);
  };

  const handleDownload = () => {
    const headers = [
      { header: "Test ID", key: "_id" },
      { header: "Assessment Name", key: "assessmentName" },
      { header: "Module Name", key: "moduleName" },
      { header: "Max Marks", key: "maxMarks" },
      { header: "Time Limit", key: "timelimit" },
      { header: "Proctoring - Mic", key: "proctoringMic" },
      { header: "Proctoring - Camera", key: "proctoringCam" },
      { header: "Start Date", key: "startDate" },
      { header: "Last Date", key: "lastDate" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(
      testData.map((test) => ({
        _id: test._id,
        assessmentName: test.assessmentName,
        moduleName: test.Assessmentmodules[0]?.module.moduleName,
        maxMarks: test.maxMarks,
        timelimit: test.timelimit,
        proctoringMic: test.ProctoringFor?.mic?.inUse ? "Yes" : "No",
        proctoringCam: test.ProctoringFor?.cam?.inUse ? "Yes" : "No",
        startDate: new Date(test.startDate).toLocaleDateString(),
        lastDate: new Date(test.lastDate).toLocaleDateString(),
      })),
      { header: headers.map((h) => h.header) }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Details");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "TestDetails.xlsx");
  };

  const handleEdit = (testId) => {
    navigate(`/edit-assessment/${testId}`);
  };

  // Get current tests for pagination
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = testData.slice(indexOfFirstTest, indexOfLastTest);

  // format date
  function formatDate(dateString) {
    const dateObj = new Date(dateString); // Keep this as a Date object

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
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = `${hours}.${minutes}${ampm}`;

    return `${day} ${month} ${year} ${time}`;
  }

  if (loading) {
    return <Loader />;
  }

  // console.log(testData[0]?.ProctoringFor);
  return (
    <div className="mx-6">
      <Toaster />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Assessment Name
              </th>
              <th className="py-3 px-4 text-left font-semibold border-b">
                Module Name
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
            {currentTests.map((assessment, index) => (
              <tr
                key={index}
                className="hover:bg-green-50 transition duration-150"
              >
                <td className="py-3 px-4 border-b">
                  {assessment.assessmentName}
                </td>
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
                    assessment.ProctoringFor?.PhoneinFrame?.inUse &&
                      "PhoneInFrame",
                    assessment.ProctoringFor?.SoundCaptured?.inUse &&
                      "SoundCaptured",
                    assessment.ProctoringFor?.ControlKeyPressed?.inUse &&
                      "ControlKeyPressed",
                    assessment.ProctoringFor?.invisiblecam?.inUse &&
                      "invisiblecam",
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
                <td className="py-3 px-4 border-b ">
                  <div className="flex gap-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEdit(assessment._id)}
                    >
                      <FaRegEdit className="text-xl" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(assessment._id)}
                    >
                      <MdDelete className="text-xl" />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => handleViewQuestions(assessment._id)}
                    >
                      <MdVisibilityOff className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {questionsModalOpen && (
        <AllQuestions
          open={questionsModalOpen}
          onClose={handleModalClose}
          testId={selectedTestId}
        />
      )}
      {/* Pagination */}
      <div className="flex items-center justify-between">
      <div className="flex items-center mt-4">
        <span className="mr-2">Rows per page:</span>
        <select
          value={testsPerPage}
          onChange={handleChangeRowsPerPage}
          className="px-2 py-1 rounded bg-gray-200 text-gray-700"
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-500 disabled:opacity-50"
        >
          {"<"}
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded-lg mx-1 ${
              currentPage === index + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-500 disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this test?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TestDetails;
