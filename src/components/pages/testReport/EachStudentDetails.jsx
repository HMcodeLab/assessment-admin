import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import QuickSummery from "./components/QuickSummery";
import Score from "./components/sectionalSummary/SectionScore";
import StrengthMain from "./components/strengthWeakness/StrengthMain";
import TestAnalysis from "./components/Analysis/TestAnalysis";
import ProtectingScore from "./components/ProtectingScore";
import Carousel from "./components/SnapShots";
import Loader from "../../Loader";
import * as XLSX from "xlsx"; // Import xlsx library

const EachStudentDetails = () => {
  const { testId, studentId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assessmentName = queryParams.get("assessmentName");
  const [color, setColor] = useState({});
  const [load, setLoad] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const adminToken = localStorage.getItem("authToken");

  // console.log(assessmentName);

  const fetchData = useCallback(async () => {
    setLoad(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getUsersResultForAssessment?moduleAssessmentid=${testId}&email=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response && response.data) {
        setStudentDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  }, [testId, studentId, adminToken]);
  // Wrap getStatus in useCallback and define it first
  const getStatus = useCallback(() => {
    if (studentDetails?.isSuspended) {
      return "Suspended";
    }
    if (studentDetails?.isAssessmentCompleted) {
      return "Completed Successfully";
    }
    return "Ongoing";
  }, [studentDetails]); // Dependencies of getStatus

  let temp = true;
  useEffect(() => {
    if (temp) {
      fetchData();
      temp = false;
    }
  }, []); // Now fetchData is safely a dependency

  useEffect(() => {
    if (studentDetails) {
      const status = getStatus(); // This will always refer to the latest version
      if (status === "Suspended") {
        setColor({
          color: "text-red-500",
          bgColor: "bg-red-500",
        });
      } else if (status === "Completed Successfully") {
        setColor({
          color: "text-green-500",
          bgColor: "bg-green-500",
        });
      } else {
        setColor({
          color: "text-yellow-700",
          bgColor: "bg-yellow-700",
        });
      }
    }
  }, [studentDetails, getStatus]); // Add getStatus here

  const Dot = ({ color }) => {
    return (
      <span
        className={`xl:h-4 xl:w-4 md:w-2 md:h-2 ${color} rounded-full inline-block`}
      ></span>
    );
  };

  if (load) {
    return <Loader />;
  }

  const exportToExcel = () => {
    // Assuming studentDetails is a single object, not an array
    const student = studentDetails; // Use this single student object
  
    const worksheet = XLSX.utils.json_to_sheet([{
      Name: student?.name,
      Email: student?.email,
      Contact: student?.phone_number?.toString(),
      College: student?.college_name,
      "Passing Year": student?.year_of_passing,
      Marks: student?.analysis?.user?.totalMarks,
      Accuracy: student?.analysis?.user?.accuracy,
      Correct: student?.analysis?.user?.correct,
      Incorrect: student?.analysis?.user?.incorrect,
      Rank: student?.rank,
      HighestMarks: student?.analysis?.allUsers?.highestMarks,
      Suspended: student?.isSuspended ? "Yes" : "No",
      totalUsers: student?.totalUsers,
      mic:student?.ProctoringScore?.mic,
      webcam:student?.ProctoringScore?.webcam,
      multiplePersonInFrame:student?.ProctoringScore?.multiplePersonInFrame,
      TabSwitch:student?.ProctoringScore?.TabSwitch,
      PhoneinFrame:student?.ProctoringScore?.PhoneinFrame,
      ControlKeyPressed:student?.ProctoringScore?.ControlKeyPressed,
    }]);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Report");
    XLSX.writeFile(workbook, `${student?.name}.xlsx`);
  };
  

  return (
    <>
      {load ? (
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
      ) : (
        <Box className="xl:px-[8rem] md:px-[1rem] py-8">
          <div className="flex justify-between items-center">
            <div>
              <p className=" xl:text-2xl font-semibold md:text-sm  ">
                Hi{" "}
                <span className="capitalize text-blue-500 xl:text-lg">
                  {studentDetails?.name}
                </span>
              </p>
              <h1 className="xl:text-2xl md:text-md font-semibold">
                Here Are Your Results For{" "}
                <span className="text-green-500">{assessmentName}!</span>
              </h1>
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={exportToExcel}
            >
              Download
            </button>
            <div className="flex gap-2 items-center">
              <Dot color={color.bgColor} />
              <h2
                className={`xl:font-bold md:font-semibold xl:text-xl md:text-md ${color.color}`}
              >
                {getStatus()}
              </h2>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 my-4 xl:grid xl:grid-cols-2">
            <QuickSummery
              user={studentDetails}
              analysis={studentDetails?.analysis?.user}
            />
            <Score user={studentDetails} />
          </div>
          <div className="flex flex-col my-4 xl:grid xl:grid-cols-2 gap-2">
            <StrengthMain generatedModules={studentDetails?.generatedModules} />
            <TestAnalysis user={studentDetails} />
          </div>
          <div className="flex flex-col my-4 xl:grid xl:grid-cols-2 gap-2">
            <ProtectingScore
              ProctoringScore={studentDetails?.ProctoringScore}
            />
            {studentDetails?.userScreenshots && (
              <Carousel userScreenshots={studentDetails?.userScreenshots} />
            )}
          </div>
        </Box>
      )}
    </>
  );
};

export default EachStudentDetails;
