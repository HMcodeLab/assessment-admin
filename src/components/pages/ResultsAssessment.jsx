import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EachStudentDetails from "./EachStudentDetails";
import axios from "axios";
import { adminToken } from "../../api";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from 'react-hot-toast';

const ResultsAssessment = ({ show, onClose, student }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (student && (!student.data || student.data.length === 0)) {
      toast.error("This Student data not available");
    }
  }, [student]);

  if (!student || !student.data || student.data.length === 0) return null;

  const handleViewClick = async (studentData) => {
    setSelectedStudent(studentData);
    setDetailsModalOpen(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getuserresultbymoduleassessment`,
        {
          params: {
            userID: studentData?.user?._id,
            moduleAssessmentid: studentData.moduleAssessment,
          },
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );console.log("check response",response);

      const data = response?.data;
      const details = data?.data;

      if (details) {
        setStudentDetails(details);
      } else {
        setError("No data available.");
        toast.error("No data available.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError("Failed to load student details.");
      toast.error("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedStudent(null);
    setStudentDetails(null);
    setError(null);
  };

  return (
    <>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: "800px",
            margin: "auto",
            marginTop: "5%",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <div className="flex flex-row justify-between pb-5 border-b border-gray-200 shadow-lg">
            <IconButton onClick={onClose}>
              <IoMdArrowRoundBack />
            </IconButton>
            <div className="text-lg font-semibold uppercase">
              Showing {student?.data.length} User
              {student.data.length > 1 ? "s" : ""}
            </div>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1.2rem" }}>User Name</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem" }}>Email</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem" }}>Contact</TableCell>
                    <TableCell sx={{ fontSize: "1.2rem" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {student?.data?.map((studentData, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {studentData?.user?.name || ""}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {studentData?.user?.email || ""}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {studentData?.user?.phone || ""}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "1rem", cursor: "pointer", color: 'blue' }}
                        className="hover:text-blue-950 hover:underline"
                        onClick={() => handleViewClick(studentData)}
                      >
                        {loading && selectedStudent === studentData ? (
                          <CircularProgress size={24} />
                        ) : (
                          "View"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>

      {selectedStudent && (
        <EachStudentDetails
          open={detailsModalOpen}
          onClose={closeDetailsModal}
          studentDetails={studentDetails || {}}
          loading={loading}
          error={error}
        />
      )}
    </>
  );
};

export default ResultsAssessment;
