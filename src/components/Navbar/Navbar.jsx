import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Import images
import dashboardIcon from "../../Assets/dashboard-dark.png";
import editAssessmentIcon from "../../Assets/edit-assessment.jpg";
import accountIcon from "../../Assets/account.png";
import studentResultIcon from "../../Assets/student-result.png";
import addAssessmentIcon from "../../Assets/addassesment.png";
import candidateIcon from "../../Assets/candidate.png";
import questionIcon from "../../Assets/question.png";
import studentIcon from "../../Assets/student.png";
import defaultIcon from "../../Assets/Tag.png";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };

  const handleProfile = () => {
    navigate("/profile");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitleIcon = () => {
    if (location.pathname.startsWith("/edit-assessment/")) {
      return { title: "Edit Assessment", icon: editAssessmentIcon };
    }
    if (location.pathname.startsWith("/profile")) {
      return { title: "Admin Profile", icon: accountIcon };
    }
    if (location.pathname.startsWith("/test-report/")) {
      return { title: "Student Assessment Result", icon: studentResultIcon };
    }
    if (location.pathname.startsWith("/student-test-report/")) {
      return { title: "Student Test Report", icon: studentResultIcon };
    }
    switch (location.pathname) {
      case "/dashboard":
        return { title: "Dashboard", icon: dashboardIcon };
      case "/add-assignment":
        return { title: "Add Assignment", icon: addAssessmentIcon };
      case "/add-candidates":
        return { title: "Add Candidate", icon: candidateIcon };
      case "/testdetails":
        return { title: "Update Assessment", icon: editAssessmentIcon };
      case "/add-questions":
        return { title: "Add Questions", icon: questionIcon };
      case "/assessment-result":
        return { title: "Assessment Result", icon: studentResultIcon };
      case "/studentfeedback":
        return { title: "Student Feedback", icon: studentIcon };
      default:
        return { title: "Page Not Found", icon: defaultIcon };
    }
  };

  return (
    <nav className="flex items-center justify-between p-5">
      <div className="flex items-center gap-2">
        <img src={getPageTitleIcon().icon} alt="Page Icon" className="w-6" />
        <h1 className="text-3xl">{getPageTitleIcon().title}</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <FaUserCircle className="text-4xl cursor-pointer" onClick={handleDropdownToggle} />
        {isDropdownOpen && (
          <div className="absolute right-4 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
            <Link className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleProfile}>
              User Profile
            </Link>
            <Link
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
