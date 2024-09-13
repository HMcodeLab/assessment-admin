import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
    profile: "", // Profile is a string
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/login");
  };

  // Handle input changes for text fields
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle profile input change (assuming it's a URL or path as a string)
  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profile: e.target.value, // Store the string value in formData
    }));
  };

  // Validate form data
  const validateForm = () => {
    const { email, password, firstName, lastName, mobile, profile } = formData;
    if (!email || !password || !firstName || !lastName || !mobile || !profile) {
      toast.error("All fields are required!");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Invalid mobile number! It should be 10 digits.");
      return false;
    }
    return true;
  };

  // Submit data to API using JSON
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/registerAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // const errorData = await response.json();
        throw new Error(error?.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful", data);
      setLoading(false);
      toast.success('Registration successful!');
      navigate("/"); 
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center h-full justify-center p-4 md:p-10">
      <div className="w-full md:w-1/2 h-[65vh] flex items-center justify-center border shadow-xl rounded mb-6 md:mb-0">
        <div className="w-full max-w-md gap-3 p-4 md:p-0">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 mb-2">First Name:</label>
              <input
                type="text"
                placeholder="First Name"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 mb-2">Last Name:</label>
              <input
                type="text"
                placeholder="Last Name"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                placeholder="Type Your Email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile" className="block text-lg font-medium text-gray-700 mb-2">Mobile:</label>
              <input
                type="tel"
                placeholder="Mobile Number"
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                placeholder="Type Your Password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile" className="block text-lg font-medium text-gray-700 mb-2">Profile:</label>
              <input
                type="text"
                placeholder="Profile"
                id="profile"
                value={formData.profile}
                onChange={handleProfileChange} // Use handleProfileChange here
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={handleSignUpClick}
              className="text-green-500 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;
