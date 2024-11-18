import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import useTeachersByName from "@/Hooks/Accounts/useTeachersByName";
import { createClassroom } from "@/api/classrooms";

const AdminCreateClassRoom = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");
  const [query, setQuery] = useState("");

  const { data: teachers, isError, isLoading } = useTeachersByName(query);

  const mutation = useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      toast({
        title: "Classroom Created",
        description: "The classroom was successfully added to the system.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description:
          "An error occurred while creating the classroom. Please try again.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, teacher_id: teacherId, subject, session });
  };

  const resetForm = () => {
    setName("");
    setTeacherId("");
    setSubject("");
    setSession("");
    setQuery("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Create New Class
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Name */}
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

        {/* Searchable Teacher Selection */}
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
            {isLoading ? (
              <li className="p-2 text-gray-500">Loading...</li>
            ) : isError ? (
              <li className="p-2 text-red-500">Failed to load teachers.</li>
            ) : teachers?.length ? (
              teachers.map((teacher) => (
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

        {/* Subject */}
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

        {/* Session */}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={mutation.isLoading || !teacherId}
          >
            {mutation.isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateClassRoom;
