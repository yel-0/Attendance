import { useQuery } from "react-query";
import { fetchTeacherClassrooms } from "@/api/classrooms";

export const useTeacherClassrooms = (enabled) => {
  return useQuery("teacherClassrooms", fetchTeacherClassrooms, {
    enabled,
  });
};
