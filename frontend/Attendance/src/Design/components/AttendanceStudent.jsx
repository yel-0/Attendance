import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePickerDemo from "./DatePickerDemo";
import { useClassTimesByClassroomAndDate } from "@/Hooks/ClassTimes/useClassTimesByClassroomAndDate";
import CreateSessionDialog from "./CreateSessionDialog";
import { useMutation, useQueryClient } from "react-query";
import { createAttendances } from "@/api/attendance";
import { useAttendancesByClassTimes } from "@/Hooks/Attendances/useAttendancesByClassTimes ";
import { useUpdateAttendanceRecords } from "@/Hooks/Attendances/useUpdateAttendanceRecords ";
import { useToast } from "@/components/ui/use-toast";
import DeleteSessionDialog from "./DeleteSessionDialog";
import { Link, useParams, useNavigate } from "react-router-dom";

const formatDate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AttendanceStudent = ({ studentClass }) => {
  const { year, month, day } = useParams();
  const [date, setDate] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const updateAttendanceMutation = useUpdateAttendanceRecords();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { classId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (year && month && day) {
      setDate(new Date(`${year}-${month}-${day}`));
    } else {
      const today = new Date();
      navigate(
        `/attendance/${today.getFullYear()}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`
      );
    }
  }, [year, month, day, navigate]);

  const {
    data: classTimes,
    isLoading: classTimesLoading,
    error: classTimesError,
  } = useClassTimesByClassroomAndDate(
    studentClass.classroom.id,
    formatDate(date)
  );

  const classTimeIds = classTimes ? classTimes.map((ct) => ct.id) : [];

  const {
    data: classTimesAttendanceStudents,
    isLoading: studentIsLoading,
    isError: studentIsError,
  } = useAttendancesByClassTimes(classTimeIds);

  useEffect(() => {
    if (classTimesAttendanceStudents) {
      const initialRecords = classTimesAttendanceStudents.reduce(
        (acc, record) => {
          const key = `${record.student_id}-${record.class_time_id}`;
          acc[key] = {
            attended: record.attended,
            slotId: record.class_time_id,
          };
          return acc;
        },
        {}
      );
      setAttendanceRecords(initialRecords);
    }
  }, [classTimesAttendanceStudents]);

  const timeSlots =
    classTimes?.map((item) => ({
      time: `${item.start_time.slice(0, 2)}-${item.end_time.slice(0, 2)}`,
      id: item.id,
    })) || [];

  const handleSwitchChange = (studentId, timeSlot, attended, slotId) => {
    setAttendanceRecords((prevRecords) => ({
      ...prevRecords,
      [`${studentId}-${slotId}`]: { attended, slotId },
    }));
  };

  const handleCheckAll = (slotId, attended) => {
    setAttendanceRecords((prevRecords) => {
      const newRecords = { ...prevRecords };
      studentClass.students.forEach((student) => {
        const key = `${student.student.id}-${slotId}`;
        newRecords[key] = { attended, slotId };
      });
      return newRecords;
    });
  };

  const mutation = useMutation(createAttendances, {
    onSuccess: (data) => {
      console.log("Successfully created attendance records:", data);
    },
    onError: (error) => {
      console.error("Failed to create attendance records:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const attendanceData = studentClass.students.flatMap((student) =>
      timeSlots.map((slot) => {
        const key = `${student.student.id}-${slot.id}`;
        const attendanceRecord = attendanceRecords[key];
        return {
          student_id: student.student.id,
          class_time_id: slot.id,
          attended: attendanceRecord ? attendanceRecord.attended : false,
        };
      })
    );

    updateAttendanceMutation.mutate(attendanceData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["attendances", classTimeIds]);
        toast({
          title: "Attendance Records Updated",
          description: `${data.updatedCount} attendance records have been successfully updated.`,
          status: "success",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error Updating Attendance Records",
          description:
            error.response?.data?.message ||
            "An unexpected error occurred while updating attendance records. Please try again.",
        });
      },
    });
  };

  if (classTimesLoading || studentIsLoading) {
    return <div>Loading...</div>;
  }

  if (classTimesError || studentIsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="">
      <div className="flex flex-row justify-end items-center pb-5 gap-4">
        <div className="flex flex-row gap-2">
          <Link
            to={`/view/attendances/${classId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            Weekly
          </Link>
          <Link
            to={`/view/attendances/semester/${classId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            Monthly
          </Link>
          <CreateSessionDialog classId={classId} mydate={formatDate(date)} />
        </div>

        <DatePickerDemo />
      </div>
      <form onSubmit={handleSubmit}>
        <Table className=" border p-5 bg-white shadow">
          <TableCaption>
            A list of student attendance for the session.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead className="">Roll Number</TableHead>
              <TableHead>Name</TableHead>
              {timeSlots.map((slot, index) => (
                <TableHead key={index}>
                  <div className="flex  items-center justify-center gap-2 w-full">
                    <DeleteSessionDialog
                      time={slot.time}
                      sessionId={slot.id}
                      mydate={formatDate(date)}
                    />

                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckAll(slot.id, e.target.checked)
                      }
                      className="transform scale-150 accent-blue cursor-pointer"
                    />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentClass.students.map((student, index) => (
              <TableRow key={student.student.id}>
                <TableCell className="w-[100px]">{index + 1}</TableCell>
                <TableCell className="w-[200px]">
                  {student.student.roleNumber}
                </TableCell>
                <TableCell>{student.student.name}</TableCell>
                {timeSlots.map((slot, slotIndex) => (
                  <TableCell key={slotIndex}>
                    <div className=" flex flex-row justify-center">
                      <input
                        type="checkbox"
                        checked={
                          attendanceRecords[`${student.student.id}-${slot.id}`]
                            ?.attended || false
                        }
                        onChange={(e) => {
                          handleSwitchChange(
                            student.student.id,
                            slot.time,
                            e.target.checked,
                            slot.id
                          );
                        }}
                        className="transform scale-150 accent-blue"
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>
          {mutation.isError && (
            <div className="text-red-500 mt-2">{mutation.error.message}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AttendanceStudent;
