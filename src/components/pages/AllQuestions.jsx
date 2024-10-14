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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const AllQuestions = ({ open, onClose, testId }) => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const adminToken = localStorage.getItem("authToken");

  // Fetch assessment data
  const fetchAssessmentData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getModuleAssessment/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setModules(response?.data?.data?.Assessmentmodules || []); // Set the modules
    } catch (error) {
      console.error("Error fetching assessment data:", error);
    }
  };
let temp =true;
  // Run fetchAssessmentData when testId changes
  useEffect(() => {
    if (testId) {
      if(temp){
        fetchAssessmentData();
        temp=false;
      }
    }
  }, [testId]);

  // Handle module selection
  const handleModuleChange = (event) => {
    const moduleId = event.target.value;
    const selected = modules.find((mod) => mod._id === moduleId);
    setSelectedModule(selected || null); // Set the selected module
  };

  // Handle downloading the questions to an Excel file
  const handleDownload = () => {
    if (!selectedModule || !selectedModule.module.questions) return;

    const ws = XLSX.utils.json_to_sheet(
      selectedModule.module.questions.map((question, index) => ({
        SNo: index + 1,
        "Question Text": question.question,
        "Opt-1": question.options.opt_1,
        "Opt-2": question.options.opt_2,
        "Opt-3": question.options.opt_3,
        "Opt-4": question.options.opt_4,
        Answer: question.answer,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "questions.xlsx");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="questions-modal-title"
      aria-describedby="questions-modal-description"
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: "1500px",
          margin: "auto",
          marginTop: "5%",
          backgroundColor: "white",
          borderRadius: "8px",
          paddingRight: "10px",
          paddingLeft: "10px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <div className="flex flex-row justify-end py-0">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex flex-row justify-between pb-5 border-b border-gray-200 shadow-lg">
          <IconButton onClick={onClose}>
            <IoMdArrowRoundBack />
          </IconButton>
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel>Select Module</InputLabel>
            <Select
              value={selectedModule ? selectedModule._id : ""}
              onChange={handleModuleChange}
              label="Select Module"
            >
              {modules.map((mod) => (
                <MenuItem key={mod._id} value={mod._id}>
                  {mod.module.moduleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            onClick={handleDownload}
            className="flex flex-row gap-2 justify-center items-center text-xl font-semibold border p-2 rounded-xl bg-green-500 hover:bg-green-600 cursor-pointer"
          >
            <MdOutlineFileDownload /> Download Questions
          </div>
        </div>

        {selectedModule && selectedModule.module.questions ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="text-lg font-semibold uppercase">
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>SNo.</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Question Text</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Opt-1</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Opt-2</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Opt-3</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Opt-4</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedModule.module.questions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-justify ">{question.question}</TableCell>
                    <TableCell>{question.options.opt_1}</TableCell>
                    <TableCell>{question.options.opt_2}</TableCell>
                    <TableCell>{question.options.opt_3}</TableCell>
                    <TableCell>{question.options.opt_4}</TableCell>
                    <TableCell>{question.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>Select a module to view questions</div>
        )}
      </Box>
    </Modal>
  );
};

export default AllQuestions;
