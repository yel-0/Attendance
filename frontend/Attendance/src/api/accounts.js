import axiosInstance from "./axiosInstance";

export const fetchAccounts = async () => {
  const response = await axiosInstance.get("/accounts");
  return response.data;
};

export const fetchAccountsByRole = async (role) => {
  const response = await axiosInstance.get(`/accounts/role/${role}`);
  return response.data;
};
