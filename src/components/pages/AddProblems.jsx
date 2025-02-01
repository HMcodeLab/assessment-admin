import React, { useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const AddProblems = () => {
  const initialProblemState = {
    title: "",
    problem_id: "",
    problem_detail: "",
    topicTags: [],
    initial_user_func: {
      cpp: { initial_code: "" },
      java: { initial_code: "" },
      javascript: { initial_code: "" },
      python: { initial_code: "" },
    },
    sample_test_cases: [{ input: "", expected_output: "" }],
    final_test_case: [{ input: "", expected_output: "" }],
    problem_solutions: {
      cpp: "",
      java: "",
      javascript: "",
      python: "",
    },
    levels: "easy",
  };

  const [problem, setProblem] = useState(initialProblemState);
  const adminToken = localStorage.getItem("authToken");

  const handleInputChange = (field, value) => {
    setProblem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setProblem((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...prev[category][field],
          initial_code: value,
        },
      },
    }));
  };

  const handleSolutionChange = (language, value) => {
    setProblem((prev) => ({
      ...prev,
      problem_solutions: {
        ...prev.problem_solutions,
        [language]: value,
      },
    }));
  };


  const handleArrayChange = (category, arrayIndex, field, value) => {
    const updatedArray = [...problem[category]];
    updatedArray[arrayIndex][field] = value;
    setProblem((prev) => ({
      ...prev,
      [category]: updatedArray,
    }));
  };

  const addTestCase = (category) => {
    setProblem((prev) => ({
      ...prev,
      [category]: [...prev[category], { input: "", expected_output: "" }],
    }));
  };

  const deleteTestCase = (category, index) => {
    const updatedArray = problem[category].filter((_, i) => i !== index);
    setProblem((prev) => ({
      ...prev,
      [category]: updatedArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(problem);
      
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/createProblem`,
        problem,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
        }
      );

      console.log(response);
      
      if (response) {
        toast.success("Problem submitted successfully!");
        setProblem(initialProblemState);
      } else {
        toast.error("Failed to add problem.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the problem.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold">Add Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col p-3">
          <label htmlFor="title" className="font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={problem.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col p-3">
          <label htmlFor="problem_id" className="font-semibold mb-1">
            Problem ID
          </label>
          <input
            type="text"
            id="problem_id"
            required
            value={problem.problem_id}
            onChange={(e) => handleInputChange("problem_id", e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col p-3">
          <label htmlFor="problem_detail" className="font-semibold mb-1">
            Problem Detail
          </label>
          <textarea
            id="problem_detail"
            value={problem.problem_detail}
            onChange={(e) => handleInputChange("problem_detail", e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          />
        </div>
        <div className="flex flex-col p-3">
          <label htmlFor="topicTags" className="font-semibold mb-1">
            Topic Tags (comma-separated)
          </label>
          <input
            type="text"
            id="topicTags"
            value={problem.topicTags.join(", ")}
            onChange={(e) =>
              handleInputChange(
                "topicTags",
                e.target.value.split(",").map((tag) => tag.trim())
              )
            }
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="p-3">
          <h3 className="font-bold text-xl">Initial User Function</h3>
          {["cpp", "java", "javascript", "python"].map((lang) => (
            <div key={lang} className="mt-2">
              <label htmlFor={`${lang}_initial_code`}>
                {lang.toUpperCase()} Code
              </label>
              <textarea
                id={`${lang}_initial_code`}
                value={problem.initial_user_func[lang].initial_code}
                onChange={(e) =>
                  handleNestedInputChange(
                    "initial_user_func",
                    lang,
                    e.target.value
                  )
                }
                className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-xl">Problem Solutions</h3>
          {["cpp", "java", "javascript", "python"].map((lang) => (
            <div key={lang} className="mt-2">
              <label htmlFor={`${lang}_solution`}>
                {lang.toUpperCase()} Solution
              </label>
              <textarea
                id={`${lang}_solution`}
                value={problem.problem_solutions[lang]}
                onChange={(e) =>
                  handleSolutionChange(lang, e.target.value)
                }
                className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
        <div>
          <span className="flex items-center gap-2">
          <h3 className="font-bold text-xl">Sample Test Cases</h3>
          <IoAddCircleSharp
            onClick={() => addTestCase("sample_test_cases")}
            className="text-2xl text-blue-500 hover:cursor-pointer"
          />
          </span>
          {problem.sample_test_cases.map((testCase, index) => (
            <div key={index} className="p-3 mt-3 bg-gray-50 rounded-lg">
              <label>Input</label>
              <input
                type="text"
                value={testCase.input}
                onChange={(e) =>
                  handleArrayChange(
                    "sample_test_cases",
                    index,
                    "input",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-lg"
              />
              <label>Expected Output</label>
              <input
                type="text"
                value={testCase.expected_output}
                onChange={(e) =>
                  handleArrayChange(
                    "sample_test_cases",
                    index,
                    "expected_output",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex justify-end">
              <button
                type="button"
                onClick={() => deleteTestCase("sample_test_cases", index)}
                className="bg-red-500 text-white p-2 mt-2 rounded-lg"
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3">
          <span className="flex items-center gap-2">
          <h3 className="font-bold text-xl">Final Test Cases</h3>
          <IoAddCircleSharp
            onClick={() => addTestCase("final_test_case")}
            className="text-2xl text-blue-500 hover:cursor-pointer"
          />
          </span>
          {problem.final_test_case.map((testCase, index) => (
            <div key={index} className="p-3 mt-3 bg-gray-50 rounded-lg">
              <label>Input</label>
              <input
                type="text"
                value={testCase.input}
                onChange={(e) =>
                  handleArrayChange(
                    "final_test_case",
                    index,
                    "input",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-lg"
              />
              <label>Expected Output</label>
              <input
                type="text"
                value={testCase.expected_output}
                onChange={(e) =>
                  handleArrayChange(
                    "final_test_case",
                    index,
                    "expected_output",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex justify-end">
              <button
                type="button"
                onClick={() => deleteTestCase("final_test_case", index)}
                className="bg-red-500 text-white p-2 mt-2 rounded-lg"
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3">
          <label htmlFor="levels">Difficulty Level</label>
          <select
            id="levels"
            value={problem.levels}
            onChange={(e) => handleInputChange("levels", e.target.value)}
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="p-3 mt-4 bg-green-500 text-white rounded-lg"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblems;
