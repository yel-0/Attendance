import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";

const fetchClassroomById = async (id) => {
  const response = await axiosInstance.get(`/classrooms/${id}`);
  return response.data.classroom;
};

const useClassroomById = (id) => {
  return useQuery(["classroom", id], () => fetchClassroomById(id), {
    enabled: !!id,
  });
};

export default useClassroomById;
