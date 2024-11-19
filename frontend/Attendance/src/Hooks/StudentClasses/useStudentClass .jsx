import { useQuery } from "react-query";
import { fetchStudentClass } from "@/api/studentClass";
export const useStudentClass = (classId) => {
  return useQuery(["studentClass", classId], () => fetchStudentClass(classId), {
    enabled: !!classId,
  });
};
