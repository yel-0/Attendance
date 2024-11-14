import { useState, useEffect } from "react";

export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  return { user };
};
