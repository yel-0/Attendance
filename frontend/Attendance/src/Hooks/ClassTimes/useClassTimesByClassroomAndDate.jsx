import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchClassTimesByClassroomAndDate = async (
  classroom_id,
  session_date
) => {
  const { data } = await axiosInstance.get(
    `/class-times/classroom/${classroom_id}/date/${session_date}`
  );
  return data;
};

export const useClassTimesByClassroomAndDate = (classroom_id, session_date) => {
  return useQuery(
    ["classTimes", classroom_id, session_date],
    () => fetchClassTimesByClassroomAndDate(classroom_id, session_date),
    {
      enabled: !!classroom_id && !!session_date,
    }
  );
};
