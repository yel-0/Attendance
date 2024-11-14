import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchAuthUserAttendancesByMonth = async (reqdata) => {
  const { data } = await axiosInstance.post("/attendances-by-month", reqdata);
  return data;
};

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
