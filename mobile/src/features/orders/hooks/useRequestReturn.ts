import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { QUERY_KEYS } from "@/query/queryKeys";

interface Payload {
  orderId: string;
  returnReason: string;
}

export function useRequestReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, returnReason }: Payload) => {
      const { data } = await api.post(API_ENDPOINTS.ORDERS.RETURN(orderId), {
        returnReason,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS.DETAIL(variables.orderId),
      });
    },
  });
}
