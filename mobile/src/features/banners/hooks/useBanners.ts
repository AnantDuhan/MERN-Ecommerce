import { useQuery } from "@tanstack/react-query";
import { BannersRepository } from "../repositories/banners.repository";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: BannersRepository.list,
    staleTime: 5 * 60 * 1000,
  });
}
