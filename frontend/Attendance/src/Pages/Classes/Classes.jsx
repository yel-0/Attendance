import React from "react";
import ClassCardByTeacher from "@/Design/components/ClassCardByTeacher";
import { useTeacherClassrooms } from "@/Hooks/Classrooms/useTeacherClassrooms ";

const Classes = () => {
  const { data, isError, isLoading } = useTeacherClassrooms();

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div className="min-h-screen  p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Classes</h2>
      <div className="flex flex-wrap justify-center">
        {data?.map((classInfo) => (
          <ClassCardByTeacher key={classInfo.id} classData={classInfo} />
        ))}
      </div>
    </div>
  );
};

export default Classes;
