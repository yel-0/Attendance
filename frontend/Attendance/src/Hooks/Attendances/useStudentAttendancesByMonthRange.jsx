import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchStudentAttendancesByMonthRange = async (params) => {
  const response = await axiosInstance.post(
    "/student/attendances/month-range",
    params
  );
  return response.data;
};

const useStudentAttendancesByMonthRange = ({
  year,
  startMonth,
  endMonth,
  classId,
  enabled,
}) => {
  const params = { year, startMonth, endMonth, classId };

  return useQuery(
    ["studentAttendancesByMonthRange", year, startMonth, endMonth, classId],
    () => fetchStudentAttendancesByMonthRange(params),
    {
      enabled: !!year && !!startMonth && !!endMonth && !!classId && !!enabled, // Only fetch if all values are available
    }
  );
};

export default useStudentAttendancesByMonthRange;
