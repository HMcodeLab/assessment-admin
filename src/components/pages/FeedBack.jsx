import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { IoIosMore,IoIosLess } from "react-icons/io";

const StudentFeed = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const adminToken = localStorage.getItem("authToken");
  const [showFullText, setShowFullText] = useState(false);

  // Fetch data from server
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/getAllUserFeedbacks`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      if (response && response.data) {
        setFeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.log("Error in fetching feedbacks form", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle date change directly with date parameter
  const handleDateChange = (date) => {
    setSelectedDate(date === "All Dates" ? "" : date);
    setIsDropdownOpen(false); // Close dropdown after selecting
  };

  // Format date for dropdown display and comparison
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    return `${day}-${month}-${year}`;
  };

  // Get a list of unique dates from feedbacks
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

  // Format date for displaying feedbacks
  function formatDateShow(dateString) {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    const month = monthNames[dateObj.getUTCMonth()];
    let hours = dateObj.getUTCHours();
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    return `${day} ${month} ${year}, ${hours}.${minutes}${ampm}`;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <ImSpinner9 className="animate-spin text-green-600 size-[8vh] mx-auto my-[25%]" />
    );
  }

  return (
    <>
      <div className="relative h-[80px] p-4 bg-gray-100 rounded-t-lg">
        <div className="absolute right-4">
          <button
            onClick={toggleDropdown}
            className="px-2 py-1 border-2 rounded-2xl flex justify-between gap-2 items-center"
          >
            <img src="time.png" alt="" />
            {selectedDate || "All Dates"}
            <img
              src="down.png"
              alt=""
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg">
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDateChange("All Dates")}
                >
                  All Dates
                </li>
                {uniqueDates.map((date, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDateChange(date)}
                  >
                    {date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Feedback by students */}
      <div className="h-[80vh] p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1fc074] scrollbar-track-[#15262d] bg-gray-100">
        <div className="flex flex-col gap-3">
          {filteredFeedbacks.map((item, index) => (
            <div
              key={index}
              className="flex flex-col w-full rounded-[13px] p-2 bg-white gap-2 shadow-lg"
            >
              <h1 className="font-semibold text-lg text-blue-950 flex items-end">
                {showFullText ? item.feedback : item.feedback.slice(0, 100)}
                {item.feedback.length > 100 && (
                  <span
                    className="cursor-pointer text-sm text-blue-500 underline"
                    onClick={() => setShowFullText(!showFullText)}
                  >
                    {showFullText ? "show less" : <IoIosMore />}
                  </span>
                )}
              </h1>
              <ul>
                <li className="text-sm font-semibold text-blue-950">
                  <span className="text-slate-400 text-sm font-semibold">
                    Name{" "}
                  </span>
                  : {item.name}
                </li>
                <li className="text-sm font-semibold text-blue-950">
                  <span className="text-slate-400 text-sm font-semibold">
                    Email{" "}
                  </span>
                  : {item.email}
                </li>
                <li className="text-sm font-semibold text-blue-950">
                  <span className="text-slate-400 text-sm font-semibold">
                    Date{" "}
                  </span>
                  : {formatDateShow(item.createdAt)}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentFeed;

