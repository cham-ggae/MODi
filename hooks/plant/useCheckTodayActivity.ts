import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";
import { ActivityType } from "@/types/plants.type";

export const useCheckTodayActivity = (
  type: ActivityType,
  options?: Partial<Parameters<typeof useQuery>[0]>
) => {
  return useQuery({
    queryKey: ["activity", "check-today", type],
    queryFn: () => plantApi.checkTodayActivity(type),
    staleTime: 1000 * 60 * 60,
    ...options,
  });
};
