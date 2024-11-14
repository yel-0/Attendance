import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchAttendancesByClassTimes = async (classTimeIds) => {
  const { data } = await axiosInstance.post("/attendances/by-class-times", {
    class_time_ids: classTimeIds,
  });
  return data;
};

export const useAttendancesByClassTimes = (classTimeIds) => {
  return useQuery(
    ["attendances", classTimeIds],
    () => fetchAttendancesByClassTimes(classTimeIds),
    {
      enabled: !!classTimeIds && classTimeIds.length > 0,
    }
  );
};
