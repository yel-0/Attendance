import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UpdateStudentDialog = ({ student }) => {
  return (
    <Dialog>
      <DialogTrigger className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
        Update
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
          <DialogDescription>
            Update the details for {student.name}.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              defaultValue={student.name}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Class Name</label>
            <input
              type="text"
              defaultValue={student.className}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter class name"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Update
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentDialog;
