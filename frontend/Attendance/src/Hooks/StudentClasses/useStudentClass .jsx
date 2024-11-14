import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
// Define the custom hook
export const useStudentClass = (classId) => {
  return useQuery(
    ["studentClass", classId],
    async () => {
      const response = await axiosInstance.get(`/student-classes/${classId}`);
      return response.data;
    },
    {
      enabled: !!classId, // Only fetch if classId is defined
    }
  );
};
