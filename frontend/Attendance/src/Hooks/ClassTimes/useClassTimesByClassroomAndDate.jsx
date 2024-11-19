import { useQuery } from "react-query";
import { fetchClassTimesByClassroomAndDate } from "@/api/classtime";

export const useClassTimesByClassroomAndDate = (classroom_id, session_date) => {
  return useQuery(
    ["classTimes", classroom_id, session_date],
    () => fetchClassTimesByClassroomAndDate(classroom_id, session_date),
    {
      enabled: !!classroom_id && !!session_date, // Only fetch if both parameters are provided
    }
  );
};
