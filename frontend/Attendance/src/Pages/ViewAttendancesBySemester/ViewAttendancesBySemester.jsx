import React, { useState } from "react";
import useAttendancesBySemester from "@/Hooks/Attendances/useAttendancesBySemester ";
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
import getMonthsInRange from "@/Utility/getMonthsInRange ";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ViewAttendancesBySemester = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [fetchData, setFetchData] = useState(false);
  const startMonthToEndMonth = getMonthsInRange(startMonth, endMonth);
  const { data, error, isLoading } = useAttendancesBySemester({
    startMonth,
    endMonth,
    classId: parseInt(classId, 10),
    year: parseInt(year, 10),
    enabled: fetchData, // Only fetch when the button is clicked
  });

  const {
    data: studentClass,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useStudentClass(classId);

  const handleFetchData = () => {
    setFetchData(true); // Set fetchData to true to trigger the data fetch
  };

  if (isLoading || isClassLoading) return <div>Loading...</div>;
  if (error || isClassError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center space-x-4">
        <div className="flex-1">
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter Year"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="startMonth"
            className="block text-sm font-medium text-gray-700"
          >
            Start Month
          </label>
          <select
            id="startMonth"
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select Start Month
            </option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="endMonth"
            className="block text-sm font-medium text-gray-700"
          >
            End Month
          </label>
          <select
            id="endMonth"
            value={endMonth}
            onChange={(e) => setEndMonth(Number(e.target.value))}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select End Month
            </option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-shrink-0 flex items-center mt-6">
          <button
            onClick={handleFetchData}
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600
              
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Fetch Data
          </button>
        </div>
      </div>

      <div className="p-2"></div>
      <Table className="border bg-white p-2 shadow">
        <TableCaption>A list of students and their roll numbers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="">Roll Number</TableHead>
            <TableHead>Name</TableHead>
            {startMonthToEndMonth?.map((month, index) => (
              <TableHead key={index} className="text-center">
                {month}
              </TableHead>
            ))}
            <TableHead>Total (Attended/Total)</TableHead>
            <TableHead>%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentClass?.students?.map((student, index) => {
            let totalAttendedCount = 0;
            let totalSessions = 0;

            startMonthToEndMonth?.forEach((month) => {
              const monthData = data?.[month] || {};
              const studentAttendance =
                monthData?.students?.[student.student.id] || {};
              const attendedCount = studentAttendance?.attended_count || 0;
              const sessionsForMonth = monthData?.total_sessions || 0;

              totalAttendedCount += attendedCount;
              totalSessions += sessionsForMonth;
            });

            const overallAttendancePercentage =
              totalSessions > 0
                ? ((totalAttendedCount / totalSessions) * 100).toFixed(2)
                : 0;

            return (
              <TableRow
                key={student.student.id}
                className={
                  overallAttendancePercentage < 75 ? "bg-red-500" : "bg-white"
                } // Highlight row if attendance < 75%
              >
                <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell className="w-[200px]">
                  {student.student.roleNumber}
                </TableCell>
                <TableCell>{student.student.name}</TableCell>
                {startMonthToEndMonth?.map((month, index) => {
                  const monthData = data?.[month] || {};
                  const studentAttendance =
                    monthData?.students?.[student.student.id] || {};
                  const attendedCount = studentAttendance?.attended_count || 0;
                  const totalSessionsForMonth = monthData?.total_sessions || 0;

                  return (
                    <TableCell className="text-center" key={index}>
                      {attendedCount}{" "}
                      {totalSessionsForMonth > 0
                        ? "/" + totalSessionsForMonth
                        : ""}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center">
                  {totalAttendedCount}/{totalSessions}
                </TableCell>
                <TableCell>{overallAttendancePercentage}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewAttendancesBySemester;
