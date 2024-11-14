import axiosInstance from "./axiosInstance";

export const fetchClassrooms = async () => {
  const response = await axiosInstance.get("/classrooms");
  return response.data;
};

export const updateClassroom = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/classrooms/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred");
  }
};

export const deleteClassroom = async (id) => {
  try {
    const response = await axiosInstance.delete(`/classrooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred");
  }
};
