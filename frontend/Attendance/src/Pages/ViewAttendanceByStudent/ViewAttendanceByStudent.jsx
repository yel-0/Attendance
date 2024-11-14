import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthUserAttendancesByMonth } from "@/Hooks/Attendances/useAuthUserAttendancesByMonth ";
import calculateAttendanceByWeekForStudent from "@/Utility/calculateAttendanceByWeekForStudent ";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
  getWeeksInMonth,
  startOfMonth,
  endOfMonth,
} from "date-fns";

function categorizeAttendancesByWeek(data) {
  const year = 2024;
  const month = 7; // August (0-based index)

  // Calculate the start and end of the month
  const monthStart = startOfMonth(new Date(year, month - 1)); // Note month - 1 for 0-based index
  const monthEnd = endOfMonth(monthStart);

  // Initialize week intervals
  const weekIntervals = [];

  let weekStart = monthStart;
  let weekEnd;

  while (weekStart <= monthEnd) {
    // Calculate end of the week, ensuring it does not exceed the month's end
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Week ends 6 days after the start
    if (weekEnd > monthEnd) weekEnd = monthEnd;

    // Add the current week interval
    weekIntervals.push({
      start: weekStart,
      end: weekEnd,
      attendances: [],
    });

    // Move to the next week
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1); // Start from the next day after the current week's end
  }

  // Group attendances by weeks based on the session date
  data.forEach((attendance) => {
    const sessionDate = parseISO(attendance.class_time.session_date); // Parse the session date

    // Find the week interval where the session date falls
    const weekInterval = weekIntervals.find(({ start, end }) => {
      const isInInterval = isWithinInterval(sessionDate, { start, end });

      // Debug: Print the start, end, and result of isWithinInterval
      console.log(
        `Checking interval: ${start} - ${end}, Session Date: ${sessionDate}, In Interval: ${isInInterval}`
      );

      return isInInterval;
    });

    // If the session date is within a week, add it to the respective week's attendances
    if (weekInterval) {
      weekInterval.attendances.push(attendance);
    }
  });

  return weekIntervals; // Return the grouped data by weeks
}

const ViewAttendanceByStudent = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const { data, isLoading, error } = useAuthUserAttendancesByMonth(
    parseInt(year, 10),
    parseInt(month, 10),
    parseInt(classId, 10)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching attendances</div>;
  // if (!Array.isArray(data)) return <div>No attendance data available</div>; // Added check

  const result = categorizeAttendancesByWeek(data ? data : []);
  console.log(result);

  const res = calculateAttendanceByWeekForStudent(data, month);
  return (
    <div>
      <div className="w-full flex flex-row justify-end py-3">
        <Link
          to={`/view/attendances/student/sem/${classId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
        >
          Sem
        </Link>
      </div>
      <form className="mb-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter year"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select month</option>
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <Table className="border bg-white shadow p-2">
        <TableCaption>Attendance Summary by Week</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>အပတ်စဉ်</TableHead> {/* Week */}
            <TableHead>Total Sessions</TableHead>
            <TableHead>Attended Count</TableHead>
            <TableHead>ရာခိုင်နှုန်း</TableHead> {/* Percentage */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((weekData, index) => {
            const totalSessions = weekData.attendances.length;
            const attendedCount = weekData.attendances.filter(
              (attendance) => attendance.attended === 1
            ).length;
            const percentage = ((attendedCount / totalSessions) * 100).toFixed(
              2
            ); // Calculating the percentage

            return (
              <TableRow key={index}>
                <TableCell>week {weekData.week}</TableCell>{" "}
                {/* Display week number */}
                <TableCell>{totalSessions}</TableCell> {/* Total sessions */}
                <TableCell>{attendedCount}</TableCell>{" "}
                {/* Count of attended sessions */}
                <TableCell>{percentage}%</TableCell>{" "}
                {/* Display the attendance percentage */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewAttendanceByStudent;
