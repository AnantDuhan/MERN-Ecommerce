import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminReturnsRepository } from "../repositories/adminReturns.repository";

export function useUpdateReturnStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminReturnsRepository.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
    },
  });
}
