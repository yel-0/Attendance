import React from "react";
import { format } from "date-fns";

const TodayDateCard = () => {
  const today = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="bg-white shadow-md rounded-md p-6 w-[320px] ">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Today's Date</h2>
      <p className="text-2xl font-semibold text-black mb-5">{today}</p>
    </div>
  );
};

export default TodayDateCard;
