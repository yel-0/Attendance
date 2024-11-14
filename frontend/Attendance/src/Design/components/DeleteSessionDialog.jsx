import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";

const DeleteSessionDialog = ({ time, sessionId, mydate }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { classId } = useParams();
  const [open, setOpen] = useState(false);

  const deleteSession = async (sessionId) => {
    try {
      await axiosInstance.delete(`/class-times/${sessionId}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error deleting session"
      );
    }
  };

  const mutation = useMutation(deleteSession, {
    onSuccess: () => {
      toast({
        title: "Session deleted successfully",
      });
      // queryClient.refetchQueries(["classTimes", classId, mydate]);
      setOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const handleDelete = () => {
    mutation.mutate(sessionId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{time}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Class Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this session? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={mutation.isLoading}
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSessionDialog;
