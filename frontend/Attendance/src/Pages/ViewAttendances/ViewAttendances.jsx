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
import calculateAttendanceByWeek from "@/Utility/attendanceUtils";
// import { useAttendancesByMonth } from "@/Hooks/Attendances/useAttendancesByMonth";
// import { useStudentClass } from "@/Hooks/StudentClasses/useStudentClass";
import { useAttendancesByMonth } from "@/Hooks/Attendances/useAttendancesByMonth ";
import { useStudentClass } from "@/Hooks/StudentClasses/useStudentClass ";
const ViewAttendances = () => {
  const { classId } = useParams();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const {
    data: studentClass,
    isLoading: isClassLoading,
    isError: isClassError,
  } = useStudentClass(classId);

  const {
    data: attendances,
    isLoading: isAttendancesLoading,
    isError: isAttendancesError,
  } = useAttendancesByMonth(parseInt(classId, 10), year, month);

  if (isClassLoading || isAttendancesLoading) return <div>Loading...</div>;
  if (isClassError || isAttendancesError)
    return <div>Error fetching data.</div>;

  const studentAttendanceByWeek = attendances
    ? calculateAttendanceByWeek(attendances, month)
    : [];
  // console.log(studentAttendanceByWeek);
  const totalClassTimes = studentAttendanceByWeek?.reduce(
    (total, week) => total + week.totalClassTimes,
    0
  );

  return (
    <div className="">
      <form className="mb-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border rounded-sm "
              placeholder="Enter year"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border rounded-sm "
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
        <TableCaption>A list of student attendances.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="w-[200px]">Roll Number</TableHead>
            <TableHead>Name</TableHead>
            {studentAttendanceByWeek?.length > 0 &&
              studentAttendanceByWeek.map((week, index) => (
                <TableHead key={index}>
                  Week {week.week}
                  {index + 1}
                </TableHead>
              ))}
            <TableHead>Total Session</TableHead>

            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentClass?.students?.map((student, index) => {
            // Calculate the total attended count for the student across all weeks
            const totalAttendedCount = studentAttendanceByWeek.reduce(
              (total, week) =>
                total +
                (week.attendances[student.student.id]?.attendedCount || 0),
              0
            );

            // Calculate the percentage of attendance
            const totalWeeks = studentAttendanceByWeek.length;
            const attendancePercentage =
              totalWeeks > 0 ? (totalAttendedCount / totalWeeks) * 100 : 0;

            return (
              <TableRow key={student.student.id}>
                <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell>{student.student.roleNumber}</TableCell>
                <TableCell>{student.student.name}</TableCell>

                {studentAttendanceByWeek.map((week) => {
                  // Get the attended count for the specific week
                  const totalClassTime = week.totalClassTimes;

                  const attendedCount =
                    week.attendances[student.student.id]?.attendedCount || 0;
                  return (
                    <TableCell key={week.week}>
                      {attendedCount}/{totalClassTime}
                    </TableCell>
                  );
                })}
                <TableCell>{totalClassTimes}</TableCell>

                <TableCell className="text-right">{0}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewAttendances;
