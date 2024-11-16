import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import useClassroomById from "@/Hooks/Classrooms/useClassroomById";
import useTeachersByName from "@/Hooks/Accounts/useTeachersByName";
const updateClassroom = async (id, classroomData) => {
  const response = await axiosInstance.put(`/classrooms/${id}`, classroomData);
  return response.data;
};

const AdminUpdateClassRoom = () => {
  const { id } = useParams(); // Get classroom ID from route params
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  // Fetch classroom data using the custom hook
  const {
    data: classroom,
    isError: isClassroomError,
    isLoading: isClassroomLoading,
  } = useClassroomById(id);

  // Fetch teachers with role "teacher"
  const {
    data: teachersData,
    isError: isTeachersError,
    isLoading: isTeachersLoading,
  } = useTeachersByName(query);

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");
  // For searchable teacher input

  // Initialize state with classroom data when available
  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setTeacherId(classroom.teacher_id);
      setSubject(classroom.subject);
      setSession(classroom.session);
      setQuery(classroom.teacher.name);
    }
  }, [classroom]);

  const mutation = useMutation({
    mutationFn: (updatedData) => updateClassroom(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      toast({
        title: "Classroom updated successfully",
      });
      navigate("/admin/classes");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating class",
        description: error.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, teacher_id: teacherId, subject, session });
  };

  if (isClassroomLoading) {
    return <div>Loading...</div>;
  }

  if (isClassroomError || isTeachersError) {
    return (
      <div className="text-red-500">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Update Class Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Class Name
          </label>
          <select
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          >
            <option value="">Select a class</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Fifth Year">Fifth Year</option>
          </select>
        </div>
        {/* Teacher Searchable Input */}
        <div>
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700"
          >
            Teacher
          </label>
          <input
            type="text"
            id="teacher"
            placeholder="Search for a teacher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
          <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white">
            {isTeachersLoading ? (
              <li className="p-2 text-gray-500">Loading...</li>
            ) : isTeachersError ? (
              <li className="p-2 text-red-500">Failed to load teachers.</li>
            ) : teachersData?.length ? (
              teachersData.map((teacher) => (
                <li
                  key={teacher.id}
                  className={`p-2 cursor-pointer  ${
                    teacher.id === teacherId
                      ? "bg-blue-500 text-white" // Apply blue background and white text for selected
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setTeacherId(teacher.id); // Set teacher ID
                    setQuery(teacher.name); // Show selected teacher name
                  }}
                >
                  {teacher.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No teachers found.</li>
            )}
          </ul>
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
        </div>
        <div>
          <label
            htmlFor="session"
            className="block text-sm font-medium text-gray-700"
          >
            Session
          </label>
          <input
            id="session"
            name="session"
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            required
            placeholder="e.g., A, B, C"
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={mutation.isLoading || !teacherId}
          >
            {mutation.isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateClassRoom;
