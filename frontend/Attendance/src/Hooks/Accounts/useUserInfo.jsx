import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchUserInfo = async () => {
  const response = await axiosInstance.get("/account/info"); // Adjust the endpoint as needed
  return response.data;
};

const useUserInfo = (token) => {
  return useQuery("userInfo", fetchUserInfo, {
    enabled: !!token,
  });
};
export default useUserInfo;
