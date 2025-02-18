import React, { useState } from "react";
import {  NavLink } from "react-router-dom";
import { useAuth } from "../../AuthContext";
// feedback.png dashboard.png addasses.png addcandi.png updateass.png addquestion.png result.png
import dashboardIcon from "../../Assets/dashboard.png";
import editAssessmentIcon from "../../Assets/updateass.png";
import studentResultIcon from "../../Assets/result.png";
import addAssessmentIcon from "../../Assets/addasses.png";
import candidateIcon from "../../Assets/addcandi.png";
import questionIcon from "../../Assets/addquestion.png";
import studentIcon from "../../Assets/feedback.png";
import { FaFileCode } from "react-icons/fa";
import { FaQrcode } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosPaper } from "react-icons/io";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return isAuthenticated ? (
    <div className="min-h-screen flex p-5">
      <aside className="w-56 bg-[#15262d] text-white  p-4 rounded-lg flex flex-col justify-between">
        <nav className="flex flex-col space-y-2 ">
          <img src="/white.png" alt="" className="px-5" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <MdDashboard  />
            Dashboard
          </NavLink>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-4  px-4 py-2 bg-[#384f59] rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300"
          >
            <IoIosPaper/>
            Assessment
            {isDropdownOpen ?(
              <IoIosArrowDown className="text-white"/>
            ):(
              <IoIosArrowDown className="text-white transform rotate-180"/>
            )}
          </button>
          {isDropdownOpen && (
            <div className="flex flex-col space-y-2 bg-[#223741] rounded-lg">
              <NavLink
            to="/add-assignment"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={addAssessmentIcon} alt="" />
            Add Assesment
          </NavLink>
          <NavLink
            to="/add-candidates"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={candidateIcon} alt="" />
            Add Candidate
          </NavLink>
          <NavLink
            to="/testdetails"
            className={({ isActive }) =>
              `flex items-center  gap-1 px-3 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={editAssessmentIcon} alt="" />
            Update Assesment
          </NavLink>
          <NavLink
            to="/add-questions"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={questionIcon} alt="" />
            Add Questions
          </NavLink>
          <NavLink
            to="/assessment-result"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={studentResultIcon} alt="" />
            Assesment Result
          </NavLink>
          <NavLink
            to="/studentfeedback"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={studentIcon} alt="" />
            Student Feedback
          </NavLink>
            </div>
          )}
          
          <NavLink
            to="/AddProblems"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <FaFileCode/>
            Add Problems
          </NavLink>
          <NavLink
            to="/UpdateProblems"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <FaQrcode/>
            Update Problems
          </NavLink>
        </nav>
      </aside>
    </div>
  ) : null;
};

export default Sidebar;
