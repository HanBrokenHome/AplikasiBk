import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole, userRole }) => {
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
