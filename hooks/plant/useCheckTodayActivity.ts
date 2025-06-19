import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";
import { ActivityType } from "@/types/plants.type";

export const useCheckTodayActivity = (type: ActivityType) => {
  return useQuery({
    queryKey: ["activity", "check-today", type],
    queryFn: () => plantApi.checkTodayActivity(type),
    staleTime: 1000 * 60 * 5,
  });
};
