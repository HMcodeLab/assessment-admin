import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImSpinner9 } from "react-icons/im";

const FeedBack = () => {
  const adminToken = localStorage.getItem("authToken");
  const [loading, setloading] = useState(false);
  const [feedbacks, setfeedbacks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date

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
      if (response && response.data) {
        setfeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.log("Error in fetching feedbacks form", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Set the selected date
  };

  // Format date for dropdown display and comparison
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    return `${day}-${month}-${year}`;
  };

  // Get a list of unique dates from the feedbacks
  const uniqueDates = [
    ...new Set(feedbacks.map((feedback) => formatDate(feedback.createdAt))),
  ];

  // Filter feedbacks by the selected date
  const filteredFeedbacks =
    selectedDate === ""
      ? feedbacks // Show all feedbacks if no date is selected
      : feedbacks.filter(
          (feedback) => formatDate(feedback.createdAt) === selectedDate
        );

  if (loading) {
    return (
      <ImSpinner9 className="animate-spin text-green-600 size-[8vh] mx-auto my-[25%]" />
    );
  }

  function formatDateShow(dateString) {
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
  
    return `${day} ${month} ${year} , ${time}`;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-center text-3xl text-green-500 font-bold mb-6">
        Student Feedback Form
      </h1>

      {/* Date dropdown */}
      <div className="mb-6">
        <label htmlFor="date" className="mr-4 text-green-500 font-semibold">
          Select Date:
        </label>
        <select
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">All Dates</option>{" "}
          {/* Option to show all feedbacks */}
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

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
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((feedback, index) => (
                <tr
                  key={index}
                  className="border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="py-4 px-6 whitespace-nowrap">{index + 1}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {formatDateShow(feedback.createdAt)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback.name}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {feedback.email}
                  </td>
                  <td className="py-4 px-6">{feedback.feedback}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 px-6 text-gray-500">
                  No feedbacks available for the selected date.
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
