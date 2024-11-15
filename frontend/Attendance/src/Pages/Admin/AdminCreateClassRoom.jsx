import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import useAccountsByRole from "@/Hooks/Accounts/useAccountsByRole ";
const createClassroom = async (classroomData) => {
  const response = await axiosInstance.post("/classrooms", classroomData);
  return response.data;
};

const AdminCreateClassRoom = () => {
  const { toast } = useToast();
  const { data, isError, isLoading } = useAccountsByRole("teacher");
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");

  const mutation = useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      toast({
        title: "Classroom created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
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
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Create New Class
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Class Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          />
        </div>
        <div>
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700"
          >
            Teacher
          </label>
          <select
            id="teacher"
            name="teacher_id"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
          >
            <option value="">Select a teacher</option>
            {!isLoading &&
              !isError &&
              data.accounts.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
          </select>
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
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateClassRoom;
