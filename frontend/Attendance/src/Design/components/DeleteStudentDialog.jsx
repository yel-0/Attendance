import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams } from "react-router-dom";

const DeleteStudentDialog = ({ student }) => {
  const queryClient = useQueryClient();
  const { id: classroomId } = useParams();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const deleteMutation = useMutation(
    async () => {
      await axiosInstance.delete(`/student-classes/${student.id}`);
    },
    {
      onSuccess: () => {
        toast({
          title: "Student deleted successfully",
          variant: "success",
        });
        queryClient.invalidateQueries(["studentClass", classroomId]);

        setOpen(false);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error deleting student",
          description: error.response
            ? error.response.data
            : "An error occurred",
        });
      },
    }
  );

  // Handler for delete action
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {student.name}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            // Add your close dialog logic here if needed
          >
            Cancel
          </button>
        </div>
        {deleteMutation.isError && (
          <div className="text-red-500 mt-4">
            {deleteMutation.error.message}
          </div>
        )}
        {deleteMutation.isSuccess && (
          <div className="text-green-500 mt-4">
            Student deleted successfully!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentDialog;
