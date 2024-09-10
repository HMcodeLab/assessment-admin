import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const authToken = localStorage.getItem("authToken");

  return authToken ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
