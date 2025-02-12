import React, { useState } from "react";
import ShowSolution from "./components/ShowSolution";
import ProtectingScore from "../ProtectingScore";
import Carousel from "../SnapShots";

const CodingScore = ({ assigned_problems_set,studentDetails }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const openModal = (problem) => {
    console.log(problem);
    setSelectedProblem(problem);
    // setIsOpen(true);
  };

  
  const formatSubmissionTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };


  const closeModal = () => {
    // setIsOpen(false);
    setSelectedProblem(null);
  };

  return (
    <div>
      {assigned_problems_set.length > 0 && (
        <div>
          <p className="font-bold text-2xl my-10 bg-slate-100 text-center py-4">Coding Result</p>

          <ul className="grid grid-cols-3 md:grid-cols-2 items-center gap-4">
            {assigned_problems_set.map((problem, index) => (
              <li key={index} className="mt-2 p-4 border rounded">
                <p>
                  <strong>Language Selected:</strong>{" "}
                  {problem.selected_language}
                </p>
                <p>
                  <strong>Problem Submitted:</strong>{" "}
                  {problem.isProblemSubmitted ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Final Test Cases Passed:</strong>{" "}
                  {problem.final_test_cases_passed.from}/
                  {problem.final_test_cases_passed.to}
                </p>
                <button
                  onClick={() => openModal(problem)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  View Solution for Problem {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col my-4 xl:grid xl:grid-cols-2 gap-2">
            <ProtectingScore
              ProctoringScore={studentDetails?.CodingAssessmentProctoringScore}
            />
            {studentDetails?.CodingAssessmentUserScreenshots && (
              <Carousel
                userScreenshots={
                  studentDetails?.CodingAssessmentUserScreenshots
                }
              />
            )}
          </div>
        </div>
      )}
      {selectedProblem && (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
        //     <h2 className="text-xl font-bold mb-4">Problem Solution</h2>
        //     <p>
        //       <strong>Problem ID:</strong> {selectedProblem.problem}
        //     </p>
        //     <p>
        //       <strong>Selected Language:</strong>{" "}
        //       {selectedProblem.selected_language}
        //     </p>
        //     <pre className="bg-gray-100 p-4 rounded overflow-auto">
        //       {selectedProblem.submitted_solution}
        //     </pre>
        //     <p>
        //       <strong>Final Test Cases Passed:</strong>{" "}
        //       {selectedProblem.final_test_cases_passed.from}/
        //       {selectedProblem.final_test_cases_passed.to}
        //     </p>
        //     <button
        //       onClick={closeModal}
        //       className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        //     >
        //       Close
        //     </button>
        //   </div>
        // </div>
        <ShowSolution
          selectedProblem={selectedProblem}
          closeModal={closeModal}
          submissionTime={formatSubmissionTime(studentDetails?.CodingAssessmentSubmissionTime)}
        />
      )}
    </div>
  );
};

export default CodingScore;
