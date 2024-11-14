import { useQuery } from "react-query";
import axiosInstance from "@/api/axiosInstance";
const fetchUserInfo = async () => {
  const response = await axiosInstance.get("/account/info"); // Adjust the endpoint as needed
  return response.data;
};

const useUserInfo = () => {
  return useQuery("userInfo", fetchUserInfo, {
    onError: (error) => {
      console.error("Failed to fetch user info:", error);
    },
  });
};

export default useUserInfo;
