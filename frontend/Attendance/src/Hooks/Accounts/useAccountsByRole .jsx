import { useQuery } from "react-query";
import { fetchAccountsByRole } from "@/api/accounts";
const useAccountsByRole = (role) => {
  return useQuery(["accountsByRole", role], () => fetchAccountsByRole(role), {
    enabled: !!role,
  });
};

export default useAccountsByRole;
