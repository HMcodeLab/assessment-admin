import React, { useState, useEffect } from "react";
import { GrDocumentCsv, GrDownload } from "react-icons/gr";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import { adminToken } from "../../api";
import ResultsAssessment from "./ResultsAssessment";
import toast, { Toaster } from "react-hot-toast";

const AssignmentResult = () => {
  const [testData, setTestData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const adminToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllAssessmentForAdmin`, {
        headers: {
          Authorization: "Bearer " + adminToken,
        },
      })
      .then((response) => {
        setTestData(response?.data.data);
      })
      .catch((error) => {
        console.error("Error fetching test details:", error);
      });
  }, []);

  const handleViewClick = (testId) => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsersResultForAssessment/${testId}`,
        {
          headers: {
            Authorization: "Bearer " + adminToken,
          },
        }
      )
      .then((response) => {
        if (response?.data?.success === false) {
          toast.error(
            response?.data?.message || "No User's Assessment Report Found"
          );
        } else if (response?.data?.length === 0) {
          toast.error("No User's Assessment Report Found");
        } else {
          // console.log(response.data);          
          setSelectedTest(response?.data);
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user results:", error);
        toast.error("No User's Assessment Report Found.");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTest(null);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(testData, {
      header: [
        "assessmentName",
        "Assessmentmodules[0]?.module.moduleName",
        "maxMarks",
        "timelimit",
        "ProctoringFor?.mic?.inUse",
        "ProctoringFor?.cam?.inUse",
        "ProctoringFor?.tabSwitch?.inUse",
        "ProctoringFor?.multiPersonInFrame?.inUse",
        "ProctoringFor?.phoneInFrame?.inUse",
        "ProctoringFor?.soundCaptured?.inUse",
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Details");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "TestDetails.xlsx");
  };

  const handleChangePage = (event, newPage) => {
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

  return (
    <div className="p-5 ml-[12vw]">
      <Toaster position="top-center" />
      <h1 className="text-[30px] flex justify-center font-bold p-4">
        Assessment Results
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
            <TableRow>
              <TableCell sx={{ fontSize: "1.2rem" }}>Assessment Name</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Module Name</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Max Marks</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Time Limit (mins)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (Mic)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (Camera)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (TabSwitch)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (MultiPersonInFrame)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (PhoneinFrame)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Proctoring (SoundCaptured)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((test) => (
              <TableRow key={test._id}>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.assessmentName}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.Assessmentmodules[0]?.module.moduleName}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>{test.maxMarks}</TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.timelimit}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.mic?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.cam?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.tabSwitch?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.multiPersonInFrame?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.phoneInFrame?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.ProctoringFor?.soundCaptured?.inUse ? "Yes" : "No"}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem", cursor: "pointer" }}>
                  <Button
                    onClick={() => handleViewClick(test._id)}
                    variant="outlined"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={testData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for detailed view */}
      <ResultsAssessment
        show={showModal}
        onClose={handleCloseModal}
        student={selectedTest}
      />
    </div>
  );
};

export default AssignmentResult;
