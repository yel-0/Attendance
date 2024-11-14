import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Hooks/User/useAuth";
const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { user } = useAuth(); // Custom hook to get user data
  const location = useLocation();
  const userRole = user?.role; // Assuming user role is available
  // console.log(user);
  if (!userRole) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user does not have the required role, redirect to forbidden
    return <Navigate to="/forbidden" />;
  }

  // Render the component if user role is allowed
  return Element;
};

export default ProtectedRoute;
