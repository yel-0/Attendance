import { useQuery } from "react-query";
import { fetchAccounts } from "@/api/accounts";
const useAccounts = (role, rollNumber, page = 1, limit = 10) => {
  return useQuery(
    ["accounts", role, rollNumber, page, limit],
    () => fetchAccounts(role, rollNumber, page, limit),
    {
      keepPreviousData: true, // Keeps previous data while loading new page
    }
  );
};

export default useAccounts;
