import { useMutation } from "react-query";
import { updateAttendanceRecords } from "@/api/attendance";

export const useUpdateAttendanceRecords = () => {
  return useMutation(updateAttendanceRecords);
};
