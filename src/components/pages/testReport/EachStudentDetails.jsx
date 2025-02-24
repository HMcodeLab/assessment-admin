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
import CodingScore from "./components/codingPlatform/CodingScore";

const EachStudentDetails = () => {
  const { testId, studentId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assessmentName = queryParams.get("assessmentName");
  const [color, setColor] = useState({});
  const [load, setLoad] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const adminToken = localStorage.getItem("authToken");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleExpand = (moduleIndex, questionIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [`${moduleIndex}-${questionIndex}`]: !prev[`${moduleIndex}-${questionIndex}`],
    }));
  };
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
    const student = studentDetails;
    const submittedAnswers = [];

    student?.generatedModules?.forEach((module) => {
      module?.module?.generatedQustionSet
        ?.filter((question) => question?.submittedAnswer)
        .forEach((question, Qindex) => {
          submittedAnswers.push({
            Module: module?.module?.modueleInfo?.moduleName,
            "Question Number": Qindex + 1,
            Question: question?.question?.question,
            "Submitted Answer": question?.submittedAnswer,
            "Correct Answer": question?.question?.answer,
          });
        });
    });
    // Use this single student object

    const worksheet = XLSX.utils.json_to_sheet([
      {
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
        mic: student?.ProctoringScore?.mic,
        webcam: student?.ProctoringScore?.webcam,
        multiplePersonInFrame: student?.ProctoringScore?.multiplePersonInFrame,
        TabSwitch: student?.ProctoringScore?.TabSwitch,
        PhoneinFrame: student?.ProctoringScore?.PhoneinFrame,
        ControlKeyPressed: student?.ProctoringScore?.ControlKeyPressed,
      },
      ...submittedAnswers,
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Report");
    XLSX.writeFile(workbook, `${student?.name}.xlsx`);
  };

  const formatSubmissionTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;


    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours} hr `;
    }
    if (minutes > 0 || hours > 0) {
      // Include minutes if there are hours
      formattedTime += `${minutes} min `;
    }
    formattedTime += `${remainingSeconds} sec`;

    return formattedTime;
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
        <Box className="px-4 py-8">
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
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <p className="text-red-500 font-semibold">Submission Time : </p>
                <span>
                  {studentDetails?.submissionTime
                    ? formatSubmissionTime(studentDetails?.submissionTime)
                    : "N/A"}
                </span>
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
          <div className="mx-auto p-4">
      {studentDetails?.generatedModules?.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="bg-gray-100 p-4 border-b ">
            <h2 className="text-xl font-semibold text-gray-800">
              Module: {module?.module?.modueleInfo?.moduleName}
            </h2>
          </div>

          <div className="p-4 grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {module?.module?.generatedQustionSet
              ?.filter((question) => question?.submittedAnswer)
              .map((question, Qindex) => {
                const isExpanded = expandedQuestions[`${moduleIndex}-${Qindex}`];
                const fullText = question?.question?.question || "";
                const truncatedText = fullText.length > 50 ? fullText.slice(0, 50) + "..." : fullText;

                return (
                  <div
                    key={Qindex}
                    className="mb-4 border-l-4 border-green-500 bg-green-50 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center p-3 h-6 w-6 rounded-full bg-green-500 text-white text-sm font-medium mr-2">
                          {Qindex + 1}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-700">
                            Question:{" "}
                            <span>{isExpanded ? fullText : truncatedText}</span>
                          </h3>
                          {fullText.length > 150 && (
                            <button
                              className="text-blue-500 hover:underline text-sm mt-1"
                              onClick={() => toggleExpand(moduleIndex, Qindex)}
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </button>
                          )}
                          <p className="font-bold text-green-500 p-3">Answer: <span className="font-normal text-black">{question?.question?.answer}:- {question?.question?.options?.[question?.question?.answer]}</span></p>
                        </div>
                      </div>

                      <div
                        className={`ml-8 mt-2 p-3 rounded border border-gray-200 ${
                          question?.question?.answer === question?.submittedAnswer
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <p className="text-gray-800">{question?.submittedAnswer} :-  {question?.question?.options?.[question?.submittedAnswer]}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Show a message if no submitted answers */}
            {module?.module?.generatedQustionSet?.filter(
              (q) => q?.submittedAnswer
            ).length === 0 && (
              <div className="col-span-4 text-center py-8 text-gray-500">
                No answers have been submitted for this module.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
          {studentDetails?.isCodingAssessmentCompleted && (
            <CodingScore
              assigned_problems_set={studentDetails?.assigned_problems_set}
              studentDetails={studentDetails}
            />
          )}
          {/* <div className="flex flex-col my-4"> */}
          {/* </div> */}
        </Box>
      )}
    </>
  );
};

export default EachStudentDetails;
