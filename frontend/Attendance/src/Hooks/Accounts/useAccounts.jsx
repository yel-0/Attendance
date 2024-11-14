import { useQuery } from "react-query";
import { fetchAccounts } from "@/api/accounts";
const useAccounts = () => {
  return useQuery(["accounts"], fetchAccounts);
};

export default useAccounts;
