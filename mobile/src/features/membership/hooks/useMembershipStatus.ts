import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MembershipRepository } from "../repositories/membership.repository";

export function useMembershipStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: string) => MembershipRepository.status(subscriptionId),
    onSuccess: (membership) => {
      queryClient.setQueryData(["membership", "current"], membership);
    },
  });
}
