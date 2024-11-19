import axiosInstance from "./axiosInstance";
// Fetch class times by classroom and session date using query parameters
// Used in : AttendanceStudent.jsx
export const fetchClassTimesByClassroomAndDate = async (
  classroom_id,
  session_date
) => {
  const { data } = await axiosInstance.get("/filter/class-times", {
    params: { classroom_id, session_date },
  });
  return data;
};

// Function to create a new class time
// Used in : CreateSessionDialog.jsx
export const createClassTime = async (classTimeData) => {
  const response = await axiosInstance.post(
    "/create/class-times",
    classTimeData
  );
  return response.data;
};

// API function for deleting a session
// Used in : DeleteSessionDialog.jsx
export const deleteSessionApi = async (sessionId) => {
  try {
    const response = await axiosInstance.delete(`/class-times/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An unexpected error occurred while deleting the session."
    );
  }
};
