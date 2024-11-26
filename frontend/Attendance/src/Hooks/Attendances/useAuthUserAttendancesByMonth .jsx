import { useQuery } from "react-query";
import { fetchAuthUserAttendancesByMonth } from "@/api/attendance";

export const useAuthUserAttendancesByMonth = (year, month, classId) => {
  const reqdata = { year, month, classId };
  return useQuery(
    ["authUserAttendances", { year, month, classId }],
    () => fetchAuthUserAttendancesByMonth(reqdata),
    {
      enabled: !!year && !!month && !!classId, // Only fetch if year, month, and classId are provided
    }
  );
};
