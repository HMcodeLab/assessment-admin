import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import AddAssignment from "./components/pages/AddAssignment";
import AssignmentResult from "./components/pages/AllAssignmentModules";
import Navbar from "./components/Navbar/Navbar";
import AddCandidates from "./components/pages/AddCandidates";
import EditAssessment from "./components/pages/EditAssessment";
import TestDetails from "./components/pages/TestDetails";
import LoginPage from "./components/login/signup/LoginPage";
import Register from "./components/login/signup/Register";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./AuthContext";
import AdminProfile from "./components/profile/AdminProfile";
import AddQuestions from "./components/pages/AddQuestions";
import AllStudentDetails from "./components/pages/testReport/AllStudentDetails";
import EachStudentDetails from "./components/pages/testReport/EachStudentDetails";
import FeedBack from "./components/pages/FeedBack";
import AllQuestions from "./components/pages/AllQuestions";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden"> 
        <div className="flex flex-1 overflow-hidden"> {/* Ensures no overflow unless necessary */}
          {isAuthenticated && (
            <div className="w-64">
              <Sidebar />
            </div>
          )}

          <div
            className={
              isAuthenticated
                ? "flex-1 flex flex-col overflow-hidden"  // Removed overflow-y-auto here
                : "w-full flex flex-col overflow-hidden"  // Ensures content does not overflow unless necessary
            }
          >
            {isAuthenticated && <Navbar />}

            <div className="flex-1 overflow-auto px-0"> {/* Enable overflow only when needed */}
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
                  path="/add-candidates"
                  element={<PrivateRoute element={AddCandidates} />}
                />
                <Route
                  path="/edit-assessment/:testId"
                  element={<PrivateRoute element={EditAssessment} />}
                />
                <Route
                  path="/view-ques"
                  element={<PrivateRoute element={AllQuestions } />}
                />
                <Route
                  path="/testdetails"
                  element={<PrivateRoute element={TestDetails} />}
                />
                <Route
                  path="/profile"
                  element={<PrivateRoute element={AdminProfile} />}
                />
                 <Route
                  path="/AddQuestions"
                  element={<PrivateRoute element={AddQuestions} />}
                />
                 <Route
                  path="/test-report/:testId"
                  element={<PrivateRoute element={AllStudentDetails} />}
                />
                 <Route
                  path="/student-test-report/:testId/:studentId"
                  element={<PrivateRoute element={EachStudentDetails} />}
                />
                 <Route
                  path="/feedback"
                  element={<PrivateRoute element={FeedBack} />}
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
