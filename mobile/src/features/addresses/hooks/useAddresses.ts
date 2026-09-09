import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { useAuthStore } from "@/store/auth.store";
import { AddressesRepository } from "../repositories/addresses.repository";

export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: QUERY_KEYS.ADDRESSES.ALL,
    queryFn: AddressesRepository.list,
    enabled: isAuthenticated,
  });
}
