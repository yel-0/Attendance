import AttendanceStudent from "@/Design/components/AttendanceStudent";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useStudentClass } from "@/Hooks/StudentClasses/useStudentClass ";

const Attendance = () => {
  const { classId } = useParams();
  const { data: studentClass, isLoading, isError } = useStudentClass(classId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (
    <div>
      {/* <div className="text-center capitalize text-black  text-2xl font-semibold p-4">
        {studentClass.classroom.name}
      </div> */}

      <AttendanceStudent studentClass={studentClass} />
    </div>
  );
};

export default Attendance;
