import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
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
import QuestionsModal from "./QuestionsModal";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";

const EachStudentDetails = ({
  open,
  onClose,
  studentData,
  studentDetails,
  loading,
  error,
}) => {
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  console.log("check data in studentDetails", studentDetails);



  // useEffect(() => {
  //   if (open && !studentDetails) {
  //     toast.error("This data is not available");
  //   }
  // }, [open, studentDetails]);

  // if (!studentDetails) return null;
  // if (studentDetails) console.log(studentDetails);
  if(studentData) console.log(studentData);
  
  

  const { user, ProctoringScore = {}, generatedModules = [] } = studentData;

  const handleViewClick = (module) => {
    setSelectedModule(module);
    setQuestionsModalOpen(true);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: "1000px",
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
          <div className="flex flex-row justify-center pb-5 border-b border-gray-200 shadow-lg">
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>

            <div className=" text-xl font-semibold">Student Details</div>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 10, left: 10 }}
            >
              <IoMdArrowRoundBack />
            </IconButton>
          </div>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
              {/* Student Information Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="h6">
                          Student Information
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{user?.name || ""}</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{studentData?.email || ""}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{user?.phone || ""}</TableCell>
                    </TableRow> */}
                    {/* <TableRow>
                      <TableCell>College</TableCell>
                      <TableCell>{user?.college || ""}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Stream</TableCell>
                      <TableCell>{user?.stream || ""}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Year of Passing</TableCell>
                      <TableCell>{user?.yearofpass || ""}</TableCell>
                    </TableRow> */}
                    {/* <TableRow>
                      <TableCell>Profile Complete</TableCell>
                      <TableCell>{user?.isProfileComplete ? "Yes" : "No"}</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell>Total Marks</TableCell>
                      <TableCell>Marks Obtained</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{studentData?.maxMarks || 0}</TableCell>
                      <TableCell>{studentData?.totalMarks || 0}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Proctoring Score Table */}
              <TableContainer sx={{ marginTop: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="h6">Proctoring Score</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(ProctoringScore).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>
                          {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Generated Modules Table */}
              <TableContainer sx={{ marginTop: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="h5">Generated Modules</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Module ID</TableCell>
                      <TableCell>Module Name</TableCell>
                      <TableCell>Time Limit</TableCell>
                      <TableCell>Questions</TableCell>
                      <TableCell>Max Marks</TableCell>
                      <TableCell>Obtained Marks</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generatedModules.map((module) => (
                      <TableRow key={module?.module?.modueleInfo?._id || ""}>
                        <TableCell>
                          {module?.module?.modueleInfo?.module_id || ""}
                        </TableCell>
                        <TableCell>
                          {module?.module?.modueleInfo?.moduleName || ""}
                        </TableCell>
                        <TableCell>
                          {module?.module?.modueleInfo?.timelimit || ""} mins
                        </TableCell>
                        <TableCell>
                          {module?.module?.generatedQustionSet?.length || 0} Questions
                        </TableCell>
                        <TableCell>
                          {module?.module?.modueleInfo?.moduleMaxMarks || 0}
                        </TableCell>
                        <TableCell>
                          {module?.module?.modueleInfo?.moduleTotalMarks || 0}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() =>
                              handleViewClick(
                                module?.module?.generatedQustionSet || []
                              )
                            }
                            className="text-blue-500 hover:blue-800 hover:font-semibold z-10"
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Modal>

      {/* QuestionsModal */}
      {selectedModule && (
        <QuestionsModal
          open={questionsModalOpen}
          onClose={() => setQuestionsModalOpen(false)}
          module={selectedModule}
        />
      )}
    </>
  );
};

export default EachStudentDetails;
