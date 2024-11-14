// src/Design/components/AuthLayout.js
import React from "react";
import NavBar from "./NavBar";

const AuthLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen">
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
