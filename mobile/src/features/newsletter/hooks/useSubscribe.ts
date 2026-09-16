import { useMutation } from "@tanstack/react-query";
import { NewsletterRepository } from "../repositories/newsletter.repository";

export function useSubscribe() {
  return useMutation({
    mutationFn: (email: string) => NewsletterRepository.subscribe(email),
  });
}
