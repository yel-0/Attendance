import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Provider/AuthProvider";
const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { data, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <>Loading ...</>;

  const user = data?.user;
  const userRole = user?.role;

  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/forbidden" />;
  }

  return Element;
};

export default ProtectedRoute;
