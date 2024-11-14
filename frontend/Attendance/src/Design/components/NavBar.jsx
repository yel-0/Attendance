import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "./Logout";

import { useLocation } from "react-router-dom";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp, Triangle } from "lucide-react";

const NavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";
  const { role, name } = user || {};
  // const firstNameLetter = name ? name.charAt(0).toUpperCase() : "";
  return (
    <div className="flex w-full  bg-white shadow-sm py-4 px-6 h-[80px] flex-row justify-between items-center  border-b border-gray-200 ">
      {isAuthRoute ? (
        <div className="flex h-[80px] flex-row justify-center items-center ">
          <div className="text-2xl">
            <Link
              to="/"
              className="flex flex-row justify-center items-center gap-3 "
            >
              <Triangle /> Attendance System
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-2xl">Welcome Back 👋</div>
      )}

      <ul className=" ">
        {user ? (
          <li className="flex flex-row justify-center gap-4 items-center space-x-2">
            {/* <div className="bg-white shadow-lg rounded-full  flex flex-row justify-center items-center p-1">
              <Popover>
                <PopoverTrigger>
                  <CircleHelp className="text-gray-600 scale-[0.8]" />
                </PopoverTrigger>
                <PopoverContent className="p-4  bg-white rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Help & Tips
                  </h3>
                  <p className="text-gray-600 text-sm">
                    If you need assistance, feel free to check out our FAQ
                    section or contact support. Remember to save your changes
                    frequently to avoid losing progress.
                  </p>
                </PopoverContent>
              </Popover>
            </div> */}
            <div className="flex flex-col items-start ">
              <span className="capitalize  ">{name}</span>
              <span className="text-sm opacity-75">{role}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex justify-center items-center">
                {/* <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  {firstNameLetter}
                </div> */}
                <img
                  src="https://plus.unsplash.com/premium_photo-1675130119373-61ada6685d63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fHww"
                  alt=""
                  className="rounded-full w-10 h-10 select-none flex items-center justify-center object-cover"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>{role}</DropdownMenuItem> */}

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
