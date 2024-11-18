import axiosInstance from "./axiosInstance";

// Get a list of all classrooms
// Used in : AdminClasses.jsx
export const fetchClassrooms = async (name = "", session = "") => {
  const response = await axiosInstance.get("/classrooms", {
    params: { name, session },
  });
  return response.data;
};

// Create a new classroom
// Used in : AdminCreateClassRoom.jsx
export const createClassroom = async (classroomData) => {
  const response = await axiosInstance.post("/classrooms", classroomData);
  return response.data;
};

// Update an existing classroom by ID
// Used in : AdminUpdateClassRoom.jsx
export const updateClassroom = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/classrooms/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred");
  }
};

// Get a specific classroom by ID
// Used in : AdminUpdateClassRoom.jsx
export const fetchClassroomById = async (id) => {
  const response = await axiosInstance.get(`/classrooms/${id}`);
  return response.data.classroom;
};

// Delete a classroom by ID
// Used in : DeleteClassDialog.jsx
export const deleteClassroom = async (id) => {
  try {
    const response = await axiosInstance.delete(`/classrooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred");
  }
};

// Get classrooms by teacher ID
// Used in : SideBarNavigation.jsx
export const fetchTeacherClassrooms = async () => {
  const response = await axiosInstance.get("/teacher/classrooms");
  return response.data;
};
