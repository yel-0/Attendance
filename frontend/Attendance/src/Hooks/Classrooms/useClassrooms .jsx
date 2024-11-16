import { useQuery } from "react-query";
import { fetchClassrooms } from "@/api/classrooms";

const useClassrooms = (name = "", session = "") => {
  return useQuery(["classrooms", name, session], () =>
    fetchClassrooms(name, session)
  );
};

export default useClassrooms;
