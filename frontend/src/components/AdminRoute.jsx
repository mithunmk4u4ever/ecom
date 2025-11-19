import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Not an admin → redirect to home
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Admin → allow access
  return children;
};

export default AdminRoute;
