import { useQuery } from "react-query";
import { fetchTeachersByName } from "@/api/accounts";
const useTeachersByName = (query) => {
  return useQuery(["teachersByName", query], () => fetchTeachersByName(query), {
    enabled: !!query,
  });
};

export default useTeachersByName;
