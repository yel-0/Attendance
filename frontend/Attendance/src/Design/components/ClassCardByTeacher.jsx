import React from "react";
import { Link } from "react-router-dom";

const ClassCardByTeacher = ({ classData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm mx-auto mb-4 transition-transform transform hover:scale-105">
      <div className="p-4">
        {/* <Link
          to={`/students/${classData.id}`}
          className="text-blue-500 hover:text-blue-600 font-medium text-sm mb-2 inline-block"
        >
          View Students
        </Link> */}

        <Link
          to={`/classSessions/${classData.id}`}
          className="block p-4 hover:bg-gray-50 transition-colors rounded-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            {classData.name}
          </h3>
        </Link>
      </div>
    </div>
  );
};

export default ClassCardByTeacher;
