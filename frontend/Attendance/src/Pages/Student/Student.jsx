import React from "react";
import { useParams } from "react-router-dom";
import { useStudentClass } from "@/Hooks/StudentClasses/useStudentClass ";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateStudentDialog from "@/Design/components/CreateStudentDialog";
import DeleteStudentDialog from "@/Design/components/DeleteStudentDialog";
import { useToast } from "@/components/ui/use-toast";
import { ImportIcon } from "lucide-react";
import ImportStudentClassDialog from "@/Design/components/ImportStudentClassDialog";

const Student = () => {
  const { id: classId } = useParams();
  const { data: studentClass, isLoading, isError } = useStudentClass(classId);
  const { toast } = useToast();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  const students = studentClass?.students || [];
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {`${studentClass?.classroom?.name || ""} ${
          studentClass?.classroom?.subject || ""
        } ${studentClass?.classroom?.session || ""}`}
      </h2>
      <div className="flex flex-row gap-4 justify-end mb-2 w-full">
        <CreateStudentDialog />
        <ImportStudentClassDialog />
      </div>
      <Table className="border bg-white shadow ">
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>

            <TableHead>Roll Number</TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.student.id}>
                <TableCell>{student.student.id}</TableCell>
                <TableCell>{student.student.roleNumber}</TableCell>
                <TableCell>{student.student.name}</TableCell>
                <TableCell>{student.student.email}</TableCell>
                <TableCell className="text-center">
                  <DeleteStudentDialog student={student} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Student;
