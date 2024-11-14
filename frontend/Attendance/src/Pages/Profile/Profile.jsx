import React from "react";
import StudentClassCard from "@/Design/components/StudentClassCard ";
const Profile = () => {
  const classData = [
    {
      id: 1,
      name: "Math 101",
    },
    {
      id: 2,
      name: "Science 201",
    },
    {
      id: 3,
      name: "History 101",
    },
  ];

  const studentData = {
    1: {
      progress: "75%",
      assignments: "3 pending",
    },
    2: {
      progress: "80%",
      assignments: "1 pending",
    },
    3: {
      progress: "60%",
      assignments: "5 pending",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Classes</h2>
      <div className="flex flex-wrap justify-center">
        {classData.map((classInfo) => (
          <StudentClassCard
            key={classInfo.id}
            classData={classInfo}
            studentData={studentData[classInfo.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
