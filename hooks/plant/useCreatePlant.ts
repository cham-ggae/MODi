import { plantApi } from "@/lib/api/plant";
import { handleplantApiError } from "@/lib/api/plant-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatPlant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: plantApi.createplant,
    onSuccess: () => {
      toast.success("새싹이 생성되었습니다");
      queryClient.invalidateQueries({ queryKey: ["plant"] });
    },
    onError: (error) => {
      const message = handleplantApiError(error);
      toast.error(message);
    },
  });
};
