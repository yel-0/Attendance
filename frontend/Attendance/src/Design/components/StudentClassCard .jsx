import React from "react";
import { Link } from "react-router-dom";

const StudentClassCard = ({ classData, studentData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm mx-auto mb-4 transition-transform transform hover:scale-105">
      <div className="p-4">
        <Link
          to={`/classDetails/${classData.id}`}
          className="block p-4 hover:bg-gray-50 transition-colors rounded-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            {classData.name}
          </h3>
          <p className="text-gray-700 mt-1">
            <span className="font-medium">Progress:</span>{" "}
            {studentData.progress}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default StudentClassCard;
