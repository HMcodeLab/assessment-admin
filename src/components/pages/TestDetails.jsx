import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Switch,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import { GrDocumentCsv, GrDownload } from "react-icons/gr";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { adminToken } from "../../api";

const TestDetails = () => {
  const [testData, setTestData] = useState([]);
  const [enabledTests, setEnabledTests] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [testsPerPage] = useState(5); // Number of tests per page
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_DOMAIN}/getallmoduleassessment`, {
        headers: {
          Authorization: "Bearer " + adminToken,
        },
      })
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
      });
  }, []);

  const handleToggle = (testId) => {
    const newVisibility = !enabledTests[testId];

    axios
      .put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/changeassessmentvisiblity/${testId}`,
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

  // const handleDeleteClick = (testId) => {
  //   setSelectedTestId(testId);
  //   setOpenDeleteDialog(true);
  // };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/deletemodulefromassessment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Admin ${adminToken}`,
          },
          body: JSON.stringify({
            moduleAssessmentid: selectedTestId, // replace this with the actual module assessment ID
            moduleid: "66cda0af48671d0f30160556", // replace this with the actual module ID
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
    navigate(`/EditAssessment/${testId}`);
  };

  // Get current tests for pagination
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = testData.slice(indexOfFirstTest, indexOfLastTest);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-5">
      <Toaster />
      <h1 className="text-[30px] flex justify-center font-bold p-4">
        Assessment Details
      </h1>
      <div className="flex justify-end">
        <Button variant="contained" color="primary" onClick={handleDownload}>
          <div className="flex justify-between p-2">
            <span className="pr-3">
              <GrDocumentCsv className="text-xl" />
            </span>
            <span>
              <GrDownload className="text-xl" />
            </span>
          </div>
        </Button>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="border">
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Assessment Name
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Module Name
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Max Marks
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Time Limit (mins)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (Mic)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (Camera)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (TabSwitch)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (MultiPersonInFrame)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (PhoneinFrame)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Proctoring (SoundCaptured)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Start Date
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Last Date
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Enable/Disable
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }} className="border">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTests.map((test) => (
              <TableRow key={test._id} className="border">
                <TableCell className="border">{test?.assessmentName}</TableCell>
                <TableCell className="border">
                  {test.Assessmentmodules[0]?.module?.moduleName}
                </TableCell>
                <TableCell className="border">{test?.maxMarks}</TableCell>
                <TableCell className="border">{test?.timelimit}</TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.mic?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.cam?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.tabSwitch?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.multiPersonInFrame?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.phoneinFrame?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {test.ProctoringFor?.soundCaptured?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell className="border">
                  {new Date(test.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="border">
                  {new Date(test.lastDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="border">
                  <Switch
                    checked={enabledTests[test._id] || false}
                    onChange={() => handleToggle(test._id)}
                  />
                </TableCell>
                <TableCell className="border">
                  <Button onClick={() => handleEdit(test._id)}>
                    <FaRegEdit className="text-xl" />
                  </Button>
                  {/* <Button onClick={() => handleDeleteClick(test._id)}>
                    <MdDelete className="text-xl" />
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math?.ceil(testData.length / testsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="flex justify-center mt-4"
      />

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
