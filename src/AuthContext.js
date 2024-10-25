import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to manage login state and functions
export const AuthProvider = ({ children }) => {
  // Check if there is an auth token in localStorage and set initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const { exp } = jwtDecode(token);
      // Check if token is expired
      if (Date.now() < exp * 1000) {
        return true;
      } else {
        localStorage.removeItem("authToken"); // Clean up if expired
      }
    }
    return false;
  });

  // Function to handle login and store the token
  const login = (token) => {
    localStorage.setItem("authToken", token); // Save token in localStorage
    setIsAuthenticated(true); // Set authentication state to true
  };

  // Function to handle logout and remove the token
  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setIsAuthenticated(false); // Set authentication state to false
  };

  // Effect to check token expiration on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        logout(); // Log out if token is expired
      }
    }
  }, []);

  // Provide the authentication state and functions to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
