import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plantApi } from "@/lib/api/plant";

export const useMarkRewardAsUsed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardLogId: number) => plantApi.markRewardAsUsed(rewardLogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reward", "family-history"] });
    },
  });
};
