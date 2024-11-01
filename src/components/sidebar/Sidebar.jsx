import React from "react";
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

const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="min-h-screen flex p-5">
      <aside className="w-56 bg-[#15262d] text-white  p-4 rounded-lg flex flex-col justify-between">
        <nav className="flex flex-col space-y-2 ">
          <img src="white.png" alt="" className="px-5" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center  gap-2 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
                isActive ? "bg-[#1fc074] text-white" : ""
              }`
            }
          >
            {" "}
            <img src={dashboardIcon} alt="" />
            Dashboard
          </NavLink>
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
              `flex items-center  gap-1 px-4 py-2 rounded hover:bg-[#4f4f52] hover:text-white transition-all duration-300 ${
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
        </nav>
      </aside>
    </div>
  ) : null;
};

export default Sidebar;
