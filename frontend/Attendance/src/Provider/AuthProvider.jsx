import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useUserInfo from "@/Hooks/Accounts/useUserInfo";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    return tokenData && tokenData.expiresAt > new Date().getTime()
      ? tokenData.value
      : null;
  });

  const { data, isLoading } = useUserInfo(token);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Set token from localStorage if not already set
      const tokenData = JSON.parse(localStorage.getItem("token"));
      if (tokenData && tokenData.expiresAt > new Date().getTime()) {
        setToken(tokenData.value);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const login = (tokenValue) => {
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
    <AuthContext.Provider value={{ token, data, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
