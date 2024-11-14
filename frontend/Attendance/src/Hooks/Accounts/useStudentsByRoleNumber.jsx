import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchStudentsByRoleNumber = async (roleNumber) => {
  const { data } = await axiosInstance.get(`/accounts/students/${roleNumber}`);
  return data;
};

export const useStudentsByRoleNumber = (roleNumber) => {
  return useQuery(
    ["students", roleNumber],
    () => fetchStudentsByRoleNumber(roleNumber),
    {
      enabled: !!roleNumber,
    }
  );
};
