import React from "react";

const ShowSolution = ({ selectedProblem, closeModal, submissionTime }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Problem Solution</h2>
        <p>
          <strong>Problem ID:</strong> {selectedProblem.problem}
        </p>
        <p>
          <strong>Submission Time:</strong> {submissionTime}
        </p>
        <p>
          <strong>Selected Language:</strong>{" "}
          {selectedProblem.selected_language}
        </p>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {selectedProblem.submitted_solution}
        </pre>
        <p>
          <strong>Final Test Cases Passed:</strong>{" "}
          {selectedProblem.final_test_cases_passed.from}/
          {selectedProblem.final_test_cases_passed.to}
        </p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowSolution;
