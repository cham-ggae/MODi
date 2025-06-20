//SRP를 위한 훅 분리 실행

import { plantApi } from "@/lib/api/plant";
import { handleplantApiError } from "@/lib/api/plant-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClaimReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plantApi.claimReward,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plant"] });
      console.log("보상 내용:", data);
      toast.success("보상을 성공적으로 수령했습니다! 🎉");
    },
    onError: (error) => {
      const message = handleplantApiError(error);
      toast.error(message);
    },
  });
};
