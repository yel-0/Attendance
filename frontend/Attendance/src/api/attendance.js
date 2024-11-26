import axiosInstance from "./axiosInstance";
export const createAttendances = async (attendances) => {
  try {
    const response = await axiosInstance.post("/attendances", { attendances });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      throw new Error(
        `Request failed with status ${error.response.status}: ${
          error.response.data.message || "Unknown error"
        }`
      );
    } else {
      console.error("Request error:", error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

// Function to update attendance records
export const updateAttendanceRecords = async (attendanceData) => {
  const { data } = await axiosInstance.put("/attendances", {
    attendances: attendanceData,
  });
  return data;
};

export const fetchAttendancesByMonth = async (classId, year, month) => {
  if (!classId || !year || !month) return [];

  const { data } = await axiosInstance.post("/attendances/monthly", {
    classId: parseInt(classId), // Ensure classId is an integer
    year,
    month,
  });
  return data;
};
