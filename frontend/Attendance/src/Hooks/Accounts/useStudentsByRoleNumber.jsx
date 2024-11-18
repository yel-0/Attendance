import { useQuery } from "react-query";
import { fetchStudentsByRoleNumber } from "@/api/accounts";
export const useStudentsByRoleNumber = (roleNumber) => {
  return useQuery(
    ["students", roleNumber],
    () => fetchStudentsByRoleNumber(roleNumber),
    {
      enabled: !!roleNumber,
    }
  );
};
