import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import NotFoundPage from "./components/NotFound";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        {isAuthenticated && (
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-40">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div
          className={
            isAuthenticated
              ? "flex-1 flex flex-col ml-64 h-full overflow-x-hidden"
              : "w-full flex flex-col h-full overflow-x-hidden"
          }
        >
          {/* Navbar */}
          {isAuthenticated && <Navbar />}

          {/* Main Section */}
          <div className="flex-1 overflow-auto scroll-smooth pl-6">
            <Routes>
              {/* Redirect to dashboard if authenticated */}
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
              />

              {/* Protected Routes */}
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
              <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
              <Route path="/add-assignment" element={<PrivateRoute element={AddAssignment} />} />
              <Route path="/assessmentresult" element={<PrivateRoute element={AssignmentResult} />} />
              <Route path="/add-candidates" element={<PrivateRoute element={AddCandidates} />} />
              <Route path="/edit-assessment/:testId" element={<PrivateRoute element={EditAssessment} />} />
              <Route path="/testdetails" element={<PrivateRoute element={TestDetails} />} />
              <Route path="/profile" element={<PrivateRoute element={AdminProfile} />} />
              <Route path="/AddQuestions" element={<PrivateRoute element={AddQuestions} />} />
              <Route path="/test-report/:testId" element={<PrivateRoute element={AllStudentDetails} />} />
              <Route path="/student-test-report/:testId/:studentId" element={<PrivateRoute element={EachStudentDetails} />} />
              <Route path="/feedback" element={<PrivateRoute element={FeedBack} />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
