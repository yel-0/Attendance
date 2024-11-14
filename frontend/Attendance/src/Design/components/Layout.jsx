import React from "react";
import SideBarNavigation from "./SideBarNavigation";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#f1f5f9]">
      <div className="flex relative flex-row justify-between items-start">
        <div className="hidden lg:block sticky top-0 w-[300px]">
          <SideBarNavigation />
        </div>

        <div className="flex flex-col  w-full justify-start items-center">
          <NavBar />

          <main className="w-full min-h-screen p-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
