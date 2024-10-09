import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";

const FeedBack = () => {
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);
  const [feedbacks, setfeedbacks] = useState([]);

  const fetchData = async () => {
    setloading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllUserFeedbacks`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      console.log(response.data.feedbacks);
      if (response && response.data) {
        setfeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.log("Error in fetching feedbacks form", error);
    } finally {
      setloading(false);
    }
  };

  let temp = true;
  useEffect(() => {
    if (temp) {
      fetchData();
      temp = false;
    }
  }, []);

  if (loading) {
    return (
      <ImSpinner9 className="animate-spin text-green-600 size-[8vh] mx-auto my-[25%]" />
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-center text-3xl text-green-500 font-bold mb-6">
        Student Feedback Form
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Id
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <tr
                  key={index}
                  className="border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?._id}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?.name}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?.email}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?.feedback}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 px-6 text-gray-500">
                  No feedbacks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedBack;
