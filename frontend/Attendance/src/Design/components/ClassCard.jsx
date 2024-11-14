import React from "react";
import { Link } from "react-router-dom";
import UpdateClassDialog from "./UpdateClassDialog";
import DeleteClassDialog from "./DeleteClassDialog";

const ClassCard = ({ classData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm mx-auto mb-4 transition-transform transform hover:scale-105">
      <div className="p-4">
        <Link
          to={`/students/${classData.id}`}
          className="text-blue-500 hover:text-blue-600 font-medium text-sm mb-2 inline-block"
        >
          View Students
        </Link>

        <h3 className="text-xl font-semibold text-gray-900">
          {classData.name}
        </h3>
        <p className="text-gray-700 mt-1">
          <span className="font-medium">Teacher:</span> {classData.teacher.name}
        </p>
        <p className="text-gray-700 mt-1">
          <span className="font-medium">Email:</span> {classData.teacher.email}
        </p>
      </div>
      <div className="flex justify-end p-4 gap-5 bg-gray-50 border-t border-gray-200">
        <UpdateClassDialog classData={classData} />
        <DeleteClassDialog classData={classData} />
      </div>
    </div>
  );
};

export default ClassCard;
