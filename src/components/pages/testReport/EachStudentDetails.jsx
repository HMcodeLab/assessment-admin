import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import QuickSummery from "./components/QuickSummery";
import Score from "./components/sectionalSummary/SectionScore";
import StrengthMain from "./components/strengthWeakness/StrengthMain";
import TestAnalysis from "./components/Analysis/TestAnalysis";
import ProtectingScore from "./components/ProtectingScore";
import Carousel from "./components/SnapShots";
import Loader from "../../Loader";

const EachStudentDetails = () => {
  const { testId, studentId } = useParams();
  const [color, setColor] = useState({});
  const [load, setLoad] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const adminToken = localStorage.getItem("authToken");

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
              <p className="font-semibold md:text-sm xl:text-lg">
                Hi {studentDetails?.name} ,
              </p>
              <h1 className="xl:text-2xl md:text-md font-semibold">
                Here Are Your Results For{" "}
                <span className="text-green-500">Designing Assessment!</span>
              </h1>
            </div>
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
          {/* <fieldset className="flex flex-col gap-2 border border-red-500 p-4 w-[40%] mx-auto font-semibold">
              <legend className="text-center font-semibold text-red-500 px-2 text-xl uppercase">
                Proctoring Score
              </legend>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proctoring Criteria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Microphone</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.mic}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Web Camera</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.webcam}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Tab Switching</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.TabSwitch}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Multiple Person In A Frame</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.multiplePersonInFrame}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Phone Out of Frame</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.PhoneinFrame}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Sound Captured</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500">
                      {studentDetails?.ProctoringScore?.SoundCaptured}
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset> */}
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
