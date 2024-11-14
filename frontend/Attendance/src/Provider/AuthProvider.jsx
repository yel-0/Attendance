// import useAdminStatus from "@/Hook/Users/useAdminStatus";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
import useUserInfo from "@/Hooks/Accounts/useUserInfo";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { data, isLoading } = useUserInfo();
  const { toast } = useToast();
  const navigate = useNavigate();
  // console.log(data);
  console.log("token" + token);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    if (tokenData && tokenData.expiresAt > new Date().getTime()) {
      setToken(tokenData.value);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [token]);

  const login = (tokenValue) => {
    alert("my" + tokenValue);
    const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000;
    const tokenData = {
      value: tokenValue,
      expiresAt: expirationTime,
    };

    localStorage.setItem("token", JSON.stringify(tokenData));
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out. See you again soon!",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
