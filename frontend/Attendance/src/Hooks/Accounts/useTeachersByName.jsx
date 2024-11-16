import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";

const useTeachersByName = (query) => {
  return useQuery(
    ["teachersByName", query],
    async () => {
      const response = await axiosInstance.get(`/accounts/teachers/filter`, {
        params: { name: query },
      });
      return response.data.teachers;
    },
    {
      enabled: !!query,
    }
  );
};

export default useTeachersByName;
