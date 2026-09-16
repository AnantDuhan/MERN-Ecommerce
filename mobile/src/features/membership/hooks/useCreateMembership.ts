import { useMutation } from "@tanstack/react-query";
import { PlanInterval } from "../types/membership";
import { MembershipRepository } from "../repositories/membership.repository";

export function useCreateMembership() {
  return useMutation({
    mutationFn: (interval: PlanInterval) => MembershipRepository.create(interval),
  });
}
