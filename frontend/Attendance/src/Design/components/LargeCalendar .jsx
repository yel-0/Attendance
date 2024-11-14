import React, { useState } from "react";

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getDayOfWeek = (date) => {
  return new Date(date).getDay();
};

const LargeCalendar = () => {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = getDaysInMonth(month + 1, year);
  const firstDayOfMonth = getDayOfWeek(new Date(year, month, 1));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center  px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-4xl bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
            {date.toLocaleString("default", { month: "long" })} {year}
          </h1>
        </header>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 text-center">
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Sun
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Mon
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Tue
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Wed
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Thu
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Fri
          </div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
            Sat
          </div>
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center h-8 sm:h-10 lg:h-12 text-gray-400"
            >
              {/* Empty space */}
            </div>
          ))}
          {daysArray.map((day) => (
            <div
              key={day}
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                date.getDate() === day
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setDate(new Date(year, month, day))}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LargeCalendar;
