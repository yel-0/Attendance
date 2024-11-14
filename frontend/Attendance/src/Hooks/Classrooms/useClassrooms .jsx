import { useQuery } from "react-query";
import { fetchClassrooms } from "@/api/classrooms";
// Custom hook to fetch classrooms
const useClassrooms = () => {
  return useQuery(["classrooms"], fetchClassrooms);
};

export default useClassrooms;
