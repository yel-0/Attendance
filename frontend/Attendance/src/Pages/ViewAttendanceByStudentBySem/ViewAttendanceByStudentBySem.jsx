import useStudentAttendancesByMonthRange from "@/Hooks/Attendances/useStudentAttendancesByMonthRange";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const ViewAttendanceByStudentBySem = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [fetchData, setFetchData] = useState(false);

  const { data, error, isLoading } = useStudentAttendancesByMonthRange({
    startMonth,
    endMonth,
    classId: parseInt(classId, 10),
    year: parseInt(year, 10),
    enabled: fetchData, // Only fetch when the button is clicked
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  //   console.log(data);
  const handleFetchData = () => {
    setFetchData(true); // Set fetchData to true to trigger the data fetch
  };
  return (
    <div>
      <div className="w-full flex flex-row justify-end py-3">
        <Link
          to={`/view/attendances/student/${classId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
        >
          Month
        </Link>
      </div>
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

      <Table className="border bg-white shadow mt-3">
        <TableCaption>Student Attendance Records by Month</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Monthly</TableHead>
            <TableHead className="text-center">Attended Sessions</TableHead>
            <TableHead className="text-center">Total Sessions</TableHead>
            <TableHead className="text-center">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && Object.keys(data).length > 0 ? (
            Object.keys(data).map((month) => (
              <TableRow key={month}>
                <TableCell>{month}</TableCell>
                <TableCell className="text-center">
                  {data[month].attended_count}
                </TableCell>
                <TableCell className="text-center">
                  {data[month].total_sessions}
                </TableCell>
                <TableCell className="text-center">
                  {(
                    (data[month].attended_count / data[month].total_sessions) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewAttendanceByStudentBySem;
