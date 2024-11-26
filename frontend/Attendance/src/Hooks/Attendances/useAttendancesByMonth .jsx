import { useQuery } from "react-query";
import { fetchAttendancesByMonth } from "@/api/attendance";

export const useAttendancesByMonth = (classId, year, month, fetchData) => {
  return useQuery(
    ["attendancesByMonth", classId, year, month],
    () => fetchAttendancesByMonth(classId, year, month),
    {
      enabled: !!fetchData && !!classId && !!year && !!month, // Only fetch if fetchData is true and classId, year, month are provided
    }
  );
};
