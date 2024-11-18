import { useQuery } from "react-query";
import { fetchClassroomById } from "@/api/classrooms";
const useClassroomById = (id) => {
  return useQuery(["classroom", id], () => fetchClassroomById(id), {
    enabled: !!id,
  });
};

export default useClassroomById;
