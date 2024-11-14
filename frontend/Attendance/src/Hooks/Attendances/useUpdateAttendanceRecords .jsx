import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const updateAttendanceRecords = async (attendanceData) => {
  console.log(attendanceData);
  const { data } = await axiosInstance.put("/attendances", {
    attendances: attendanceData,
  });
  return data;
};

export const useUpdateAttendanceRecords = () => {
  const queryClient = useQueryClient();

  return useMutation(updateAttendanceRecords, {
    onSuccess: () => {
      //   alert("update successful");
      //   queryClient.invalidateQueries("attendances");
    },
    onError: (error) => {
      // Handle error
      console.error("Failed to update attendance records", error);
    },
  });
};
