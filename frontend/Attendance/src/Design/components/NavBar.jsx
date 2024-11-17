import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "./Logout";
import React from "react";
import { Triangle } from "lucide-react";
import { useAuth } from "@/Provider/AuthProvider";

const NavBar = () => {
  const { data, isLoading } = useAuth();

  const user = data?.user;
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const role = user?.role;
  const name = user?.name;

  return (
    <div className="flex w-full bg-white shadow-sm py-4 px-6 h-[80px] flex-row justify-between items-center border-b border-gray-200">
      {isAuthRoute ? (
        <div className="flex h-[80px] flex-row justify-center items-center">
          <div className="text-2xl">
            <Link
              to="/"
              className="flex flex-row justify-center items-center gap-3"
            >
              <Triangle /> Attendance System
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-2xl">Welcome Back 👋</div>
      )}

      <ul>
        {isLoading ? <div>Loading...</div> : null}

        {user ? (
          <li className="flex flex-row justify-center gap-4 items-center space-x-2">
            <div className="flex flex-col items-start">
              <span className="capitalize">{name}</span>
              <span className="text-sm opacity-75">{role}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1675130119373-61ada6685d63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fHww"
                  alt="User profile picture"
                  className="rounded-full w-10 h-10 select-none flex items-center justify-center object-cover"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="py-3 flex flex-row justify-center items-center">
                  <Logout />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ) : (
          <li className="p-1">
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 transition duration-150"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavBar;
