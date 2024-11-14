import axiosInstance from "./axiosInstance";

export const createStudentClass = async (newStudentClass) => {
  try {
    const response = await axiosInstance.post(
      "/student-classes",
      newStudentClass
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred");
  }
};
