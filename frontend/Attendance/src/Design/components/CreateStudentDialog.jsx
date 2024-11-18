import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { createStudentClass } from "@/api/studentClass";
import { useStudentsByRoleNumber } from "@/Hooks/Accounts/useStudentsByRoleNumber";
const CreateStudentDialog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: classroomId } = useParams(); // Get classroomId from route parameters
  const [studentId, setStudentId] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Use the hook with the current query
  const { data: students, isLoading, isError } = useStudentsByRoleNumber(query);

  const mutation = useMutation(
    (newStudentClass) => createStudentClass(newStudentClass),
    {
      onSuccess: () => {
        toast({
          title: "Student Added to Class Successfully",
          description: `The student has been successfully added to the class "${classroomId}".`,
        });
        queryClient.invalidateQueries(["studentClass", classroomId]);
        setOpen(false);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error Adding Student to Class",
          description:
            error.message ||
            "An error occurred while adding the student to the class. Please try again later.",
        });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      student_id: studentId,
      classroom_id: classroomId, // Use classroomId from params
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Create Student
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new student-class association.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Student</label>
            <input
              type="text"
              placeholder="Search for a student..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
            <ul className="mt-2 max-h-60 overflow-y-auto border rounded-md bg-white">
              {isLoading ? (
                <li className="p-2">Loading...</li>
              ) : isError ? (
                <li className="p-2 text-red-500">Failed to load students.</li>
              ) : (
                students?.map((student) => (
                  <li
                    key={student.id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setStudentId(student.id);
                      setQuery(student.name); // Optionally set query to selected student's name
                    }}
                  >
                    {student.name} - {student.roleNumber}
                  </li>
                ))
              )}
            </ul>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={mutation.isLoading || isLoading || isError}
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentDialog;
