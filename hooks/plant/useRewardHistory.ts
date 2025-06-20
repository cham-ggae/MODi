import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";

export const useRewardHistory = () => {
  return useQuery({
    queryKey: ["reward", "history"],
    queryFn: () => plantApi.getRewardHistory(),
    staleTime: 1000 * 60 * 5,
  });
};
