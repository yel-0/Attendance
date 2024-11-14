import React from "react";
import { Link } from "react-router-dom";
// import CreateClassDialog from "@/Design/components/CreateClassDialog";
// import UpdateClassDialog from "@/Design/components/UpdateClassDialog";
// import DeleteClassDialog from "@/Design/components/DeleteClassDialog";
import CreateClassDialog from "@/Design/components/CreateClassDialog";
import UpdateClassDialog from "@/Design/components/UpdateClassDialog";
import DeleteClassDialog from "@/Design/components/DeleteClassDialog";
// import useClassrooms from "@/Hooks/Classrooms/useClassrooms";
import useClassrooms from "@/Hooks/Classrooms/useClassrooms ";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminClasses = () => {
  const { data, error, isLoading } = useClassrooms();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching classes</div>;
  }

  const classData = data || [];

  return (
    <div>
      {/* <h2 className="text-2xl font-bold text-center mb-6">Classes</h2> */}
      <div className="w-full flex flex-row justify-end  mb-2">
        <CreateClassDialog />
      </div>

      <Table className="border bg-white shadow">
        <TableCaption>A list of classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>အတန်းအမည်</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="flex flex-row justify-center items-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classData.map((classInfo) => (
            <TableRow key={classInfo.id}>
              <TableCell>{classInfo.id}</TableCell>
              <TableCell>
                <Link
                  to={`/students/${classInfo.id}`}
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                >
                  {classInfo.name}
                </Link>
              </TableCell>
              <TableCell>{classInfo.teacher.name}</TableCell>
              <TableCell>{classInfo.teacher.email}</TableCell>
              <TableCell className="flex justify-center items-center flex-row gap-4">
                <UpdateClassDialog classData={classInfo} />
                <DeleteClassDialog
                  classData={classInfo}
                  classId={classInfo.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminClasses;
