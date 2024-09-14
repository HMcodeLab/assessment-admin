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
import CMDScreen from "./components/pages/AssignmentDetails";
import AdminProfile from "./components/profile/AdminProfile";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          {isAuthenticated && <Sidebar className="w-64" />}
          <div
            className={
              isAuthenticated ? "flex-1 overflow-y-auto w-full" : "w-full"
            }
          >
            {isAuthenticated && <Navbar />}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />

              {/* Protect routes using PrivateRoute */}
              <Route path="/" element={<PrivateRoute element={Dashboard} />} />
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

                <Route
                path="/profile"
                element={<PrivateRoute element={AdminProfile} />}
              />
            

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
