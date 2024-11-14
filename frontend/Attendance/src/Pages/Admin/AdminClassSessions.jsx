import React from "react";
import { useParams } from "react-router-dom";
import useClassTimes from "@/Hooks/ClassTimes/useClassTimes";
import CreateSessionDialog from "@/Design/components/CreateSessionDialog";
import ClassSessionCard from "@/Design/components/ClassSessionCard";

const AdminClassSessions = () => {
  const { id } = useParams();
  const { data: sessionData, isLoading, isError } = useClassTimes(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading class sessions</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Class Sessions: {id}
      </h2>
      {/* <Link
        to={`/attendance/${id}`}
        className="text-blue-500 hover:underline font-semibold"
      >
        View Attendance
      </Link> */}
      <div className="flex flex-wrap justify-center">
        {sessionData.length > 0 ? (
          sessionData.map((session) => (
            <ClassSessionCard
              key={session.id}
              id={session.id}
              session={session}
            />
          ))
        ) : (
          <div>No sessions available</div>
        )}
      </div>
      <CreateSessionDialog />
    </div>
  );
};

export default AdminClassSessions;
