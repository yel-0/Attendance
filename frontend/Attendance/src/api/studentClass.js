import axiosInstance from "./axiosInstance";

// Create a new student-class association
// Used in : CreateStudentDialog.jsx
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

// Delete a student-class association by ID
// Used in : DeleteStudentDialog.jsx
export const deleteStudent = async (studentId) => {
  return await axiosInstance.delete(`/student-classes/${studentId}`);
};

// Retrieve student-class associations for a specific classroom by classroom ID
// Used in : Student.jsx
export const fetchStudentClass = async (classId) => {
  const response = await axiosInstance.get(`/student-classes/${classId}`);
  return response.data;
};

// Import student-class associations from an Excel file
// Used in : ImportStudentClassDialog.jsx
export const importStudentClasses = async (formData) => {
  console.log(formData);

  return await axiosInstance.post("/import-student-classes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Retrieve classrooms associated with the currently authenticated student
// Used in : SideBarNavigation.jsx
export const fetchClassroomsByAuthStudent = async () => {
  const { data } = await axiosInstance.get("/my-classrooms/classrooms");
  return data;
};
