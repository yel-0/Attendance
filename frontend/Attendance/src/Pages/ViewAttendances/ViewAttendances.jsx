import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendancesByMonth } from "@/Hooks/Attendances/useAttendancesByMonth ";
import { useStudentClass } from "@/Hooks/StudentClasses/useStudentClass ";

const ViewAttendances = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [fetchData, setFetchData] = useState(false);

  const {
    data: studentClass,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useStudentClass(classId);

  // Fetch attendances only when the button is clicked (controlled by fetchData)
  const {
    data: attendances,
    isLoading: isAttendancesLoading,
    isError: isAttendancesError,
  } = useAttendancesByMonth(
    fetchData ? parseInt(classId, 10) : null,
    year,
    month
  );

  if (isClassLoading || isAttendancesLoading) return <div>Loading...</div>;
  if (isClassError || isAttendancesError)
    return <div>Error fetching data.</div>;

  // Ensure that attendances_by_week is an array
  const studentAttendanceByWeek = attendances?.attendances_by_week || [];

  return (
    <div>
      <form className="mb-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Year Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter year"
            />
          </div>

          {/* Month Select */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select month</option>
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* Fetch Button */}
          <div className="flex items-center justify-center md:justify-end">
            <button
              type="button"
              onClick={() => setFetchData(true)}
              className="w-full md:w-auto py-3 px-6 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            >
              Fetch Data
            </button>
          </div>
        </div>
      </form>

      <Table className="border bg-white shadow p-2">
        <TableCaption>A list of student attendances.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="w-[150px]">Roll Number</TableHead>
            <TableHead>Name</TableHead>
            {studentAttendanceByWeek.length > 0 &&
              studentAttendanceByWeek.map((week, index) => (
                <TableHead key={index}>Week {index + 1}</TableHead>
              ))}
            <TableHead>Total Attended</TableHead>
            <TableHead>Total Session</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {studentClass?.students?.map((student, index) => {
            const totalAttendedCount = studentAttendanceByWeek.reduce(
              (total, week) => {
                const attendedCount =
                  week.students?.[student.student.id]?.attended_count || 0;
                return total + attendedCount;
              },
              0
            );

            const totalClassTimes = studentAttendanceByWeek.reduce(
              (total, week) => total + week.total_sessions,
              0
            );

            const attendancePercentage = totalClassTimes
              ? ((totalAttendedCount / totalClassTimes) * 100).toFixed(2)
              : 0;

            const rowClass =
              totalClassTimes > 0 && attendancePercentage < 75
                ? "bg-red-500 text-white"
                : "";

            return (
              <TableRow
                key={student.student.id}
                className={`${rowClass} h-[70px]`}
              >
                <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell>{student.student.roleNumber}</TableCell>
                <TableCell>{student.student.name}</TableCell>

                {studentAttendanceByWeek.map((week, weekIndex) => {
                  const attendedCount =
                    week.students?.[student.student.id]?.attended_count || 0;
                  const totalSessions = week.total_sessions;
                  return (
                    <TableCell key={weekIndex}>
                      {attendedCount}/{totalSessions}
                    </TableCell>
                  );
                })}

                <TableCell>{totalAttendedCount}</TableCell>
                <TableCell>{totalClassTimes}</TableCell>
                <TableCell className="text-right">
                  {attendancePercentage}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewAttendances;
