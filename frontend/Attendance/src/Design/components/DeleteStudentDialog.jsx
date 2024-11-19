import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
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
import { deleteStudent } from "@/api/studentClass";

const DeleteStudentDialog = ({ student }) => {
  const queryClient = useQueryClient();
  const { id: classroomId } = useParams();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useMutation(() => deleteStudent(student.id), {
    onSuccess: () => {
      toast({
        title: "Student Deleted Successfully",
        description:
          "The student has been removed from the class successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries(["studentClass", classroomId]);
      setOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Deleting Student",
        description: error.response
          ? error.response.data
          : "An error occurred while removing the student from the class. Please try again later.",
      });
    },
  });

  // Handler for delete action
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentDialog;
