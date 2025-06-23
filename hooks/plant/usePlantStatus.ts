import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";

export const usePlantStatus = (fid: number) => {
  return useQuery({
    queryKey: ["plant", "status", fid],
    queryFn: () => plantApi.getPlantStatus(fid),
    enabled: !!fid,
    staleTime: 1000 * 60 * 5,
  });
};
