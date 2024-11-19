import axiosInstance from "./axiosInstance";
// Fetch class times by classroom and session date using query parameters
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
export const createClassTime = async (classTimeData) => {
  const response = await axiosInstance.post(
    "/create/class-times",
    classTimeData
  );
  return response.data;
};
