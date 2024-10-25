import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Capture the original location user came from
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/loginAdmin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful", data);
      login(data.token); // Save token and login user

      setLoading(false);

      // Redirect to the page user was originally trying to access or default to /dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="md:flex lg:flex 2xl:flex xl:flex w-full h-full xsm:flex-col">
      {/* Left Section: Login Form */}
      <img src="logo.png" alt="Logo" className="absolute p-16" />
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-3xl font-bold text-center mb-4">LOGIN</h2>
        <p className="text-gray-700 text-center mb-6 text-lg">
          How to get started with Assessment admin !
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} onKeyDown={handleKeyPress} method="POST" className="flex justify-center gap-4 items-center flex-col">
          <div className="relative w-[150%] max-w-sm">
            {/* Username Field */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <img src="Vector-1.png" alt="User Icon" className="w-4" />
            </div>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-3 rounded-2xl shadow-sm bg-[#e4f8ef] placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="relative w-[150%] max-w-sm mt-4">
            {/* Password Field */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <img src="Vector-2.png" alt="Password Icon" className="w-4" />
            </div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 rounded-2xl shadow-sm bg-[#e4f8ef] placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 w-2/3 max-w-sm">
            <button
              className="w-full px-5 py-3 bg-[#1fc074] text-xl font-semibold text-white rounded-2xl hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Login...." : "Login Now"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Section: Promotional Banner */}
      <div
        className="w-full  flex items-center justify-center bg-cover xsm:hidden sm:hidden md:hidden"
        style={{ backgroundImage: `url('bg.png')` }}
      >
        <div className="text-start bg-[#1fc074]  w-[450px] h-[650px] p-10 rounded-[40px] absolute z-0  ">
          <p className="text-3xl font-bold text-white leading-snug">
            Very good <br /> works are <br />
            waiting for <br /> you! Login <br /> Now!!!
          </p>
          <img
            src="light.png"
            alt="Lightning Icon"
            className=" relative right-16 top-32 w-16 "
          />
        </div>

        <img
          src="womam.png"
          alt="Login promo"
          className=" relative left-10 top-7  z-10  "
        />
      </div>
    </div>
  );
};

export default LoginPage;
