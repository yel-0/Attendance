import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UpdateUserDialog = ({ user }) => {
  return (
    <Dialog>
      <DialogTrigger>Update Role</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm mb-4">Select a new role for {user.username}:</p>
          <div className="flex space-x-4">
            <button
              onClick={() => console.log(`Selected role: Student`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Student
            </button>
            <button
              onClick={() => console.log(`Selected role: Teacher`)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Teacher
            </button>
            <button
              onClick={() => console.log(`Selected role: Admin`)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Admin
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
