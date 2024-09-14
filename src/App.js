import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import AddAssignment from "./components/pages/AddAssignment";
import AssignmentResult from "./components/pages/AssignmentResult";
import Navbar from "./components/Navbar/Navbar";
import Assessment from "./components/pages/Assessment";
import EditAssessment from "./components/pages/EditAssessment";
import TestDetails from "./components/pages/TestDetails";
import LoginPage from "./components/login/signup/LoginPage";
import Register from "./components/login/signup/Register";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Main container */}
        <div className="flex flex-1">
          {/* Sidebar should have a fixed width */}
          {isAuthenticated && (
            <div className="w-64">
              <Sidebar />
            </div>
          )}

          {/* Main content area */}
          <div
            className={
              isAuthenticated
                ? "flex-1 flex flex-col overflow-y-auto"
                : "w-full flex flex-col overflow-y-auto"
            }
          >
            {isAuthenticated && <Navbar />}

            {/* Route rendering */}
            <div className="flex-1">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />

                {/* Protect routes using PrivateRoute */}
                <Route
                  path="/"
                  element={<PrivateRoute element={Dashboard} />}
                />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute element={Dashboard} />}
                />
                <Route
                  path="/add-assignment"
                  element={<PrivateRoute element={AddAssignment} />}
                />
                <Route
                  path="/assessmentresult"
                  element={<PrivateRoute element={AssignmentResult} />}
                />
                <Route
                  path="/assessment"
                  element={<PrivateRoute element={Assessment} />}
                />
                <Route
                  path="/edit-assessment/:testId"
                  element={<PrivateRoute element={EditAssessment} />}
                />
                <Route
                  path="/testdetails"
                  element={<PrivateRoute element={TestDetails} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
