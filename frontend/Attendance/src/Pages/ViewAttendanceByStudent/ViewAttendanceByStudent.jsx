import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthUserAttendancesByMonth } from "@/Hooks/Attendances/useAuthUserAttendancesByMonth ";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ViewAttendanceByStudent = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  // Fetch attendance data
  const { data, isLoading, error } = useAuthUserAttendancesByMonth(
    year ? parseInt(year, 10) : null,
    month ? parseInt(month, 10) : null,
    classId ? parseInt(classId, 10) : null
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching attendances</div>;

  // Defensive check to ensure data is defined before accessing its properties
  const { attendances_by_week = [], monthly_summary = {} } = data || {};

  // Calculate percentage
  const { total_attended, total_sessions } = monthly_summary;
  const attendancePercentage = total_sessions
    ? ((total_attended / total_sessions) * 100).toFixed(2)
    : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Navigation Link */}
      <div className="w-full flex justify-end mb-6">
        <Link
          to={`/view/attendances/student/sem/${classId}`}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
        >
          Semester View
        </Link>
      </div>

      {/* Form to Select Year and Month */}
      <div className="bg-white p-6 rounded-md shadow mb-6">
        <form className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter year"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select month</option>
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Table to Display Weekly Attendance */}
      <div className="bg-white p-6 rounded-md shadow">
        <Table>
          <TableCaption>Weekly Attendance Summary</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Week Start</TableHead>
              <TableHead>Week End</TableHead>
              <TableHead>Attended Sessions</TableHead>
              <TableHead>Total Sessions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances_by_week.map((week, index) => (
              <TableRow key={index}>
                <TableCell>{week.start_date}</TableCell>
                <TableCell>{week.end_date}</TableCell>
                <TableCell>{week.attended_count}</TableCell>
                <TableCell>{week.total_sessions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Monthly Summary */}
      <div
        className={`mt-6 p-6 rounded-md shadow ${
          data && attendancePercentage < 75 ? "bg-red-500" : "bg-blue-50"
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            data && attendancePercentage < 75 ? "text-white" : "text-blue-700"
          }`}
        >
          Monthly Summary
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center">
            <span
              className={`${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-700"
              } font-medium`}
            >
              Total Attended:
            </span>
            <span
              className={`ml-2 ${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {total_attended}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-700"
              } font-medium`}
            >
              Total Sessions:
            </span>
            <span
              className={`ml-2 ${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {total_sessions}
            </span>
          </div>
          <div className="flex items-center col-span-2">
            <span
              className={`${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-700"
              } font-medium`}
            >
              Attendance Percentage:
            </span>
            <span
              className={`ml-2 font-bold ${
                data && attendancePercentage < 75
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {attendancePercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendanceByStudent;
