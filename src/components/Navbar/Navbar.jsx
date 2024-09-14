import React, { useState } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-green-500 h-[10vh] shadow-md w-full flex justify-between items-center px-10 ">
      <div className="text-white text-2xl font-bold flex items-center pl-[15vw] ">Assessment Dashboard</div>

      {/* User Profile Section */}
      <div className="relative">
        <FaRegCircleUser
          className="w-10 h-10 cursor-pointer text-white"
          onClick={handleDropdownToggle} // Attach the onClick event to toggle dropdown
        />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
            <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              User Profile
            </a>
            <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
