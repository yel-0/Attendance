import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchClassroomsByAuthStudent = async () => {
  const { data } = await axiosInstance.get("/my-classrooms/classrooms");
  return data;
};

export const useClassroomsByAuthStudent = (enabled) => {
  return useQuery("classroomsByAuthStudent", fetchClassroomsByAuthStudent, {
    enabled, // The query will only run if `enabled` is true
  });
};
