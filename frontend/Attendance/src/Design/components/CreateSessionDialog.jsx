import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClassTime } from "@/api/classtime";

const CreateSessionDialog = ({ classId, mydate }) => {
  const { toast } = useToast();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(createClassTime, {
    onSuccess: () => {
      toast({
        title: "Class time created successfully",
      });
      queryClient.invalidateQueries(["classTimes", classId, mydate]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating class time",
        description: JSON.stringify(error.message), // Display more detailed error
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      classroom_id: classId,
      session_date: date,
      start_time: startTime,
      end_time: endTime,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600">
        Create Time
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class Time</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new class time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
            />
          </div>
          <div>
            <label
              htmlFor="startTime"
              className="block text-lg font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
            />
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block text-lg font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionDialog;
