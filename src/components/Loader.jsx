import React from 'react';
import { ImSpinner9 } from 'react-icons/im';


const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen mx-auto my-auto">
    <ImSpinner9 className="animate-spin text-3xl text-green-600" />
  </div>
  );
};

export default Loader;
