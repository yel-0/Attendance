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
