import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete} from "react-icons/md";

function UpdateProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}/getAllProblems`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setProblems(response.data.problems);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <BiError className="h-6 w-6 mr-2" />
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Problem List</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Problem Detail</th>
              <th className="border p-3 text-left">Difficulty</th>
              <th className="border p-3 text-left">Initial Code</th>
              <th className="boredr p-3 text-left">Problem solutions</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id} className="hover:bg-gray-50">
                <td className="border p-3">{problem.title}</td>
                <td className="border p-3">
                  {problem.problem_detail.length > 100
                    ? `${problem.problem_detail.substring(0, 100)}...`
                    : problem.problem_detail}
                </td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      problem.levels === "easy"
                        ? "bg-green-100 text-green-800"
                        : problem.levels === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {problem.levels}
                  </span>
                </td>
                <td className="border p-3">
                  <details className="cursor-pointer">
                    <summary className="font-medium text-sm text-green-500">
                      View Code
                    </summary>
                    <div className="mt-2 space-y-4">
                      {Object.entries(problem.initial_user_func).map(
                        ([lang, data]) => (
                          <div key={lang} className="mt-2">
                            <h4 className="font-semibold capitalize mb-1">
                              {lang}
                            </h4>
                            <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
                              {data.initial_code}
                            </pre>
                          </div>
                        )
                      )}
                    </div>
                  </details>
                </td>
                <td>
                  <details className="cursor-pointer">
                    <summary className="font-medium text-sm text-green-500 p-3">
                      View Solution
                    </summary>
                    <div>
                      {Object.entries(problem.problem_solutions).map(
                        ([lang, data]) => (
                          <div key={lang} className="mt-2">
                            <h4 className="font-semibold capitalize mb-1">
                              {lang}
                            </h4>
                            <pre className="bg-gray-50 p-2 rounded-md text-sm overflow-x-auto">
                              {data}
                            </pre>
                          </div>
                        )
                      )}
                    </div>
                  </details>
                </td>
                <td className="py-3 px-4 border-b ">
                  <div className="flex gap-2">
                    <button className="text-green-500 hover:text-green-700">
                      <FaRegEdit className="text-xl" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpdateProblems;
