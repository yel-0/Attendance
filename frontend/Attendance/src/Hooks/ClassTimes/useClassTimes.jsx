import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchClassTimes = async (classroomId) => {
  const response = await axiosInstance.get(
    `/class-times/classroom/${classroomId}`
  );
  return response.data;
};

const useClassTimes = (classroomId) => {
  return useQuery(
    ["classTimes", classroomId],
    () => fetchClassTimes(classroomId),
    {
      enabled: !!classroomId,
    }
  );
};

export default useClassTimes;
