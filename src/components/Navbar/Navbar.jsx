import React, { useState, useEffect, useRef } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload(); // Force a complete page refresh
  };

  useEffect(() => {
    // Close dropdown when clicking outside
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

  return (
    <div className="bg-green-500 h-[10vh] shadow-md w-full flex justify-between items-center px-10">
      <div className="text-white text-2xl font-bold flex items-center pl-[15vw]">Assessment Dashboard</div>

      {/* User Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <FaRegCircleUser
          className="w-10 h-10 cursor-pointer text-white"
          onClick={handleDropdownToggle}
        />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
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
    </div>
  );
};

export default Navbar;
