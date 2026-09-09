import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query/queryKeys";
import { AddressesRepository } from "../repositories/addresses.repository";
import { NewAddress } from "../types/address";

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewAddress) => AddressesRepository.add(payload),
    onSuccess: (addresses) => {
      queryClient.setQueryData(QUERY_KEYS.ADDRESSES.ALL, addresses);
    },
  });
}
