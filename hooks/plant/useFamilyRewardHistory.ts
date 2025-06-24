import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";

export const useFamilyRewardHistory = () => {
  return useQuery({
    queryKey: ["reward", "family-history"],
    queryFn: () => plantApi.getFamilyRewardHistory(),
    staleTime: 1000 * 60 * 5,
  });
};
