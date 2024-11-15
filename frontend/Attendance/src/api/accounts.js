import axiosInstance from "./axiosInstance";
export const fetchAccounts = async (role, rollNumber, page, limit) => {
  const params = {
    role,
    roll_number: rollNumber,
    page,
    limit,
  };
  console.log(params);

  const response = await axiosInstance.get("/accounts", { params });
  return response.data;
};

export const fetchAccountsByRole = async (role) => {
  const response = await axiosInstance.get(`/accounts/role/${role}`);
  return response.data;
};
