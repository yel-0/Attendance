import axiosInstance from "./axiosInstance";

// List all accounts
export const fetchAccounts = async (role, rollNumber, page, limit) => {
  const params = {
    role,
    roll_number: rollNumber,
    page,
    limit,
  };

  const response = await axiosInstance.get("/accounts", { params });
  return response.data;
};

// Get accounts by role
export const fetchAccountsByRole = async (role) => {
  const response = await axiosInstance.get(`/accounts/role/${role}`);
  return response.data;
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Register Users with excel file
export const uploadExcel = (formData) => {
  return axiosInstance.post("/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Find accounts by student role and role number
export const fetchStudentsByRoleNumber = async (roleNumber) => {
  const { data } = await axiosInstance.get(`/accounts/students/${roleNumber}`);
  return data;
};

// Update an account
export const updateAccount = async ({ id, updatedData }) => {
  await axiosInstance.put(`/accounts/${id}`, updatedData);
};

// Filter teachers by name
export const fetchTeachersByName = async (query) => {
  const response = await axiosInstance.get("/accounts/teachers/filter", {
    params: { name: query },
  });
  return response.data.teachers;
};

// Delete an account
export const deleteAccount = async ({ accountId }) => {
  await axiosInstance.delete(`/accounts/${accountId}`);
};
