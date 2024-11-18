import axiosInstance from "./axiosInstance";

// List all accounts
// Used in: UserList.jsx
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

// Register User
//Used in : Register.jsx
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
//Use in :File Upload
export const uploadExcel = (formData) => {
  return axiosInstance.post("/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update an account
//Used in :UpdateAccountDialog.jsx
export const updateAccount = async ({ id, updatedData }) => {
  await axiosInstance.put(`/accounts/${id}`, updatedData);
};

// Delete an account
//Use in : DeleteAccountDialog.jsx
export const deleteAccount = async ({ accountId }) => {
  await axiosInstance.delete(`/accounts/${accountId}`);
};

// Filter teachers by name
// Used in : AdminUpdateClassRoom.jsx
export const fetchTeachersByName = async (query) => {
  const response = await axiosInstance.get("/accounts/teachers/filter", {
    params: { name: query },
  });
  return response.data.teachers;
};

// Find accounts by student role and role number
// Used in : CreateStudentDialog.jsx
export const fetchStudentsByRoleNumber = async (roleNumber) => {
  const { data } = await axiosInstance.get(`/accounts/students/${roleNumber}`);
  return data;
};

// Get accounts by role
export const fetchAccountsByRole = async (role) => {
  const response = await axiosInstance.get(`/accounts/role/${role}`);
  return response.data;
};
