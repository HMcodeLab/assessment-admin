import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdOutlineFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { IoMdArrowRoundBack } from "react-icons/io";

const QuestionsModal = ({ open, onClose, module }) => {
  if (!module) return null;

  const handleDownload = () => {
    // Create a worksheet from the module data
    const ws = XLSX.utils.json_to_sheet(
      module.map((question, index) => ({
        SNo: index + 1,
        "Question Text": question.question.question,
        "Opt-1": question.question.options.opt_1,
        "Opt-2": question.question.options.opt_2,
        "Opt-3": question.question.options.opt_3,
        "Opt-4": question.question.options.opt_4,
        Answer: question.question.answer,
      }))
    );

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");

    // Convert the workbook to binary data and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "questions.xlsx"
    );
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

        <div className="flex flex-row justify-between right-5 pb-5 border-b border-gray-200 shadow-lg">
          <IconButton onClick={onClose}>
            <IoMdArrowRoundBack />
          </IconButton>

          <div className="text-xl font-semibold">Module Questions</div>

          <div
            onClick={handleDownload}
            className="flex flex-row gap-2 justify-center items-center text-xl font-semibold border p-2 rounded-xl bg-green-500 hover:bg-green-600 cursor-pointer"
          >
            <MdOutlineFileDownload /> Download Questions
          </div>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="text-lg font-semibold uppercase">
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  SNo.
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Question Text
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Opt-1
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Opt-2
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Opt-3
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Opt-4
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Answer
                </TableCell>
                <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                  Submitted
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {module?.map((question, index) => {
                const correctAnswer = question.question?.answer;
                const submittedAnswer = question?.submittedAnswer;

                const isCorrect = submittedAnswer === correctAnswer;

                return (
                  <TableRow key={index}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>{question?.question?.question}</TableCell>
                    <TableCell>{question.question?.options?.opt_1}</TableCell>
                    <TableCell>{question.question?.options?.opt_2}</TableCell>
                    <TableCell>{question.question?.options?.opt_3}</TableCell>
                    <TableCell>{question.question?.options?.opt_4}</TableCell>
                    <TableCell style={{ color: "green", fontWeight: "bold" }}>
                      {correctAnswer}
                    </TableCell>
                    <TableCell
                      style={{
                        color: isCorrect ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {submittedAnswer}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default QuestionsModal;

