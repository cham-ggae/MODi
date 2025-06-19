//SRP를 위한 훅 분리 실행

import { plantApi } from "@/lib/api/plant";
import { handleplantApiError } from "@/lib/api/plant-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plantApi.addPoint,
    // 여기서 경험치 바가 알아서 최신 데이터를 반영
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plant"] });
    },
    onError: (error) => {
      const message = handleplantApiError(error);
      toast.error(message);
    },
  });
};
