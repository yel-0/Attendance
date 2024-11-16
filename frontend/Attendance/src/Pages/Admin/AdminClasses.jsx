import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteClassDialog from "@/Design/components/DeleteClassDialog";
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
  const [filter, setFilter] = useState("First Year");
  const [sessionFilter, setSessionFilter] = useState(""); // State for session filter
  const { data, error, isLoading } = useClassrooms(filter, sessionFilter);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching classes</div>;
  }

  const classData = data || [];

  return (
    <div>
      {/* Filter Dropdown */}
      <div className="w-full flex flex-row justify-between mb-4">
        <div className="flex flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Fifth Year">Fifth Year</option>
          </select>

          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sessions</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
          </select>
        </div>
        <Link
          to="/create/classroom"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Classroom
        </Link>
      </div>

      {/* Classrooms Table */}
      <Table className="border bg-white shadow">
        <TableCaption>A list of classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
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
                  {classInfo.name}| {classInfo.subject} | {classInfo.session}
                </Link>
              </TableCell>
              <TableCell>{classInfo.teacher.name}</TableCell>
              <TableCell>{classInfo.teacher.email}</TableCell>
              <TableCell className="flex justify-center items-center flex-row gap-4">
                <Link
                  to={`/update/classroom/${classInfo.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Update Class
                </Link>

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
