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
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";


const AssignmentResult = () => {
  const [testData, setTestData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const adminToken = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true)
  const navigate= useNavigate();

  useEffect(() => {
    setLoading(true); // Set loading to true when the API request starts
  
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
      })
      .finally(() => {
        setLoading(false); // Set loading to false when the request finishes
      });
  }, []);
  

  const fetchData = async (testId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsersResultForAssessment/${testId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      // console.log(response?.data);  // Log the response for debugging
      if (response) {
        // setCheckStudents(response?.data);
        return response?.data
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const handleViewClick = async (testId) => {
    try {
      const response = await fetchData(testId);
      const students = response?.data || []; // Get students from response
      // console.log(response)
      if (students.length > 0) {
        navigate(`/test-report/${testId}`);
      } else {
        toast.error("No Students are available");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.");
    }
  };
  

  const handleDownload = () => {
  
    // Customize the data
    const customizedData = testData.map((item) => {
      // Build the Proctoring array
      const Proctoring = [
        item.ProctoringFor?.mic?.inUse && "Mic",
        item.ProctoringFor?.webcam?.inUse && "Webcam",
        item.ProctoringFor?.TabSwitch?.inUse && "TabSwitch",
        item.ProctoringFor?.multiplePersonInFrame?.inUse && "MultiplePersonInFrame",
        item.ProctoringFor?.PhoneinFrame?.inUse && "PhoneInFrame",
        item.ProctoringFor?.SoundCaptured?.inUse && "SoundCaptured",
      ].filter(Boolean); // Remove any falsey values
    
      return {
        Assessment: item.assessmentName,
        Modules: item?.Assessmentmodules?.length,
        Marks: item.maxMarks,
        Time: item.timelimit,
        Proctoring: Proctoring, 
        expired:item?.lastDate
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(customizedData, {
      header: [
        "Assessment",
        "Modules",
        "Marks",
        "Time",
        "Proctoring",
        "Expiry Date"
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

  function formatDate(dateString) {
    const dateObj = new Date(dateString);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

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
    const month = monthNames[dateObj.getMonth()];

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = `${hours}.${minutes}${ampm}`;

    return `${day} ${month} ${year} ${time}`;
  }

if(loading){
  return(
    <Loader/>
  )
}

  return (
    <div className="p-5">
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
        <Table className="px-8">
          <TableHead>
            <TableRow className="">
              <TableCell sx={{ fontSize: "1.2rem" }}>Assessment Name</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Total Modules</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Max Marks</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>
                Time Limit (mins)
              </TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Proctoring</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Start Date</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>End Date</TableCell>
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
                  {test?.Assessmentmodules?.length||0}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>{test.maxMarks}</TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {test.timelimit}
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1rem" }}
                  className="grid grid-cols-2"
                >
                  {[
                    test.ProctoringFor?.mic?.inUse && "Mic",
                    test.ProctoringFor?.webcam?.inUse && "Webcam",
                    test.ProctoringFor?.TabSwitch?.inUse && "TabSwitch",
                    test.ProctoringFor?.multiplePersonInFrame?.inUse &&
                      "MultiplePersonInFrame",
                    test.ProctoringFor?.PhoneinFrame?.inUse && "PhoneInFrame",
                    test.ProctoringFor?.SoundCaptured?.inUse && "SoundCaptured",
                  ]
                    .filter(Boolean) // Remove falsy values
                    .join(" , ")}{" "}
                </TableCell>

                <TableCell sx={{ fontSize: "1rem" }}>
                  {formatDate(test.startDate)}
                </TableCell>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {formatDate(test.lastDate)}
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
      {/* <ResultsAssessment
        show={showModal}
        onClose={handleCloseModal}
        student={selectedTest}
      /> */}
    </div>
  );
};

export default AssignmentResult;
