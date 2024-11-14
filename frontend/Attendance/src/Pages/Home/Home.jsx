import React from "react";
import TodayDateCard from "@/Design/components/TodayDateCard ";
import LargeCalendar from "@/Design/components/LargeCalendar ";
import SideBarNavigation from "@/Design/components/SideBarNavigation";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { role, name } = user || {};

  return (
    <div className="flex min-h-screen flex-col justify-start items-center ">
      <div className="flex flex-col lg:flex-row gap-4 lg:justify-center justify-center items-center lg:items-start w-full">
        <LargeCalendar />
        <TodayDateCard />
      </div>
    </div>
  );
};

export default Home;
