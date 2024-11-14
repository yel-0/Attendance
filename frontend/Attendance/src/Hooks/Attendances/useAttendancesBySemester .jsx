import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";

const fetchAttendancesBySemester = async (semesterData) => {
  const response = await axiosInstance.post(
    "/attendances-by-semester",
    semesterData
  );
  return response.data;
};

const useAttendancesBySemester = ({
  startMonth,
  endMonth,
  classId,
  year,
  enabled,
}) => {
  const semesterData = { startMonth, endMonth, classId, year };

  return useQuery(
    ["attendancesBySemester", startMonth, endMonth, classId, year],
    () => fetchAttendancesBySemester(semesterData),
    {
      enabled: !!startMonth && !!endMonth && !!classId && !!year && !!enabled, // Only fetch if all values are available
    }
  );
};

export default useAttendancesBySemester;
