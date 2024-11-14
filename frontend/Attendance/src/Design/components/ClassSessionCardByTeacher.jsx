import React from "react";

const ClassSessionCardByTeacher = ({ session }) => {
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  };
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-auto mb-6 p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-gray-800 text-lg font-semibold">
            <span className="font-bold">Date:</span>{" "}
            {getDayOfWeek(session.session_date)}
          </p>
          <p className="text-gray-800 text-lg font-semibold">
            <span className="font-bold">Start Time:</span> {session.start_time}
          </p>
          <p className="text-gray-800 text-lg font-semibold">
            <span className="font-bold">End Time:</span> {session.end_time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassSessionCardByTeacher;
