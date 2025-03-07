import { useQuery } from "react-query";
import { fetchClassroomsByAuthStudent } from "@/api/studentClass";

export const useClassroomsByAuthStudent = (enabled) => {
  return useQuery("classroomsByAuthStudent", fetchClassroomsByAuthStudent, {
    enabled, // The query will only run if `enabled` is true
  });
};
