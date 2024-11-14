import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchTeacherClassrooms = async () => {
  const response = await axiosInstance.get("/classrooms/teacher");
  return response.data;
};

export const useTeacherClassrooms = () => {
  return useQuery("teacherClassrooms", fetchTeacherClassrooms);
};
