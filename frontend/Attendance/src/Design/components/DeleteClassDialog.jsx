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
import { deleteClassroom } from "@/api/classrooms";
const DeleteClassDialog = ({ classData }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteClassroom(classData.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);

      setOpen(false);
      toast({
        title: `Class "${classData.name}" Deleted Successfully`,
        description: `The class "${classData.name}" has been permanently removed from the system.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Deleting Class",
        description:
          error.message ||
          "An error occurred while trying to delete the class. Please try again later.",
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-500 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        Delete Class
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the class "{classData.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClassDialog;
