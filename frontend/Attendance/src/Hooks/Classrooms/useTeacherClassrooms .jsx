import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchTeacherClassrooms = async () => {
  const response = await axiosInstance.get("/teacher/classrooms");
  return response.data;
};

export const useTeacherClassrooms = (enabled) => {
  return useQuery("teacherClassrooms", fetchTeacherClassrooms, {
    enabled,
  });
};
