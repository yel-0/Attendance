import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import useAccountsByRole from "@/Hooks/Accounts/useAccountsByRole ";
import { updateClassroom } from "@/api/classrooms";
const UpdateClassDialog = ({ classData }) => {
  const { data, isError, isLoading } = useAccountsByRole("teacher");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [name, setName] = useState(classData.name);
  const [teacherId, setTeacherId] = useState(classData.teacher.id);

  const mutation = useMutation({
    mutationFn: () =>
      updateClassroom(classData.id, { name, teacher_id: teacherId }),

    onSuccess: (data) => {
      queryClient.invalidateQueries(["classrooms"]);
      setOpen(false);
      toast({
        title: "Class updated successfully",
      });
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
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-4 py-2  rounded-lg bg-blue-400 text-white ">
        Update Class
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Class Details</DialogTitle>
          <DialogDescription>
            Update the details for the class.
          </DialogDescription>
        </DialogHeader>
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
              className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
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
              className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-lg"
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateClassDialog;
