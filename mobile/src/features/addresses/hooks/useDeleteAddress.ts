import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AddressesRepository } from "../repositories/addresses.repository";

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AddressesRepository.remove(id),
    onSuccess: (addresses) => {
      queryClient.setQueryData(QUERY_KEYS.ADDRESSES.ALL, addresses);
    },
  });
}
