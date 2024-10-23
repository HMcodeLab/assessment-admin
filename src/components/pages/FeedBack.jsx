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

  // format date
function formatDate(dateString) {
  const dateObj = new Date(dateString); // Keep this as a Date object

  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const year = dateObj.getUTCFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[dateObj.getUTCMonth()];

  let hours = dateObj.getUTCHours();
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const time = `${hours}.${minutes}${ampm}`;

  return `${day} ${month} ${year} ${time}`;
}


// let filteredDate=[]
// function handleDateFilter(){
//   feedbacks.map((date)=>{
//     date:date.createdAt
//   })
// }

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
                SNO.
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                Date
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
                    {index+1}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {formatDate(feedback?.createdAt)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?.name}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback?.email}
                  </td>
                  <td className="py-4 px-6">
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
