import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[100%] bg-gray-100 my-auto">
      <div className="text-center">
        {/* Robot Image */}
        <img 
          src="404.png"  // Replace this with the path to your image
          alt="404 robot" 
          className="w-[40%] mx-auto mb-0"
        />

        {/* 404 Text */}
        <h1 className="text-[5rem] sm:text-[1rem] font-bold text-blue-600 mb-4">404 Not Found</h1>

        {/* Error Message */}
        <p className="text-xl sm:text-[2vw] text-gray-600 mb-8">Whoops! That page doesn’t exist.</p>

        {/* Home Button */}
        <Link 
          to="/" 
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-lg sm:text-[0.5rem] transition duration-300"
        >
          HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
