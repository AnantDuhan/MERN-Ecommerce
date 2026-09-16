import { useMutation } from "@tanstack/react-query";
import { ContactRepository } from "../repositories/contact.repository";

export function useSendContact() {
  return useMutation({
    mutationFn: ContactRepository.send,
  });
}
