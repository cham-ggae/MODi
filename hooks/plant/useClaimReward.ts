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
    },
    onError: (error) => {
      const message = handleplantApiError(error);
      toast.error(message);
    },
  });
};

//컴포넌트에서 보상 모달 등에 전달
// const { mutate: claimReward } = useClaimReward();

// claimReward(undefined, {
//   onSuccess: (reward) => {
//     setRewardData(reward); // 보상 모달 등에 전달
//     setIsRewardModalOpen(true);
//   },
// });
