import { useQuery } from "@tanstack/react-query";
import { AdminRefundsRepository } from "../repositories/adminRefunds.repository";

export function useAdminRefunds() {
  return useQuery({
    queryKey: ["admin", "refunds"],
    queryFn: AdminRefundsRepository.list,
  });
}
