import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContext";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/loginAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful", data);
      login(data.token); // Set token in context
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center h-[100vh] p-4 md:p-10">
      <div className="w-full md:w-1/2 h-[55vh] flex items-center justify-center border shadow-xl rounded mb-6 md:mb-0">
        <div className="w-full max-w-md gap-3 p-4 md:p-0">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              onClick={handleSignUpClick}
              className="text-green-500 hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
