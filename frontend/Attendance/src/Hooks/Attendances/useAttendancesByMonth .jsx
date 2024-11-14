import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";

const fetchAttendancesByMonth = async (classId, year, month) => {
  if (!classId || !year || !month) return [];

  const { data } = await axiosInstance.post("/attendances/monthly", {
    classId: parseInt(classId), // Ensure classId is an integer
    year,
    month,
  });
  return data;
};

export const useAttendancesByMonth = (classId, year, month) => {
  return useQuery(
    ["attendancesByMonth", classId, year, month],
    () => fetchAttendancesByMonth(classId, year, month),
    {
      enabled: !!classId && !!year && !!month, // Only fetch if classId, year, and month are provided
    }
  );
};
