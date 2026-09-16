import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MembershipRepository } from "../repositories/membership.repository";

export function useCancelMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: string) => MembershipRepository.cancel(subscriptionId),
    onSuccess: (membership) => {
      queryClient.setQueryData(["membership", "current"], membership);
    },
  });
}
