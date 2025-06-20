import { plantApi } from "@/lib/api/plant";
import { useQuery } from "@tanstack/react-query";

export const useNutrientStatus = () => {
  return useQuery({
    queryKey: ["nutrient", "stock"],
    queryFn: () => plantApi.getNutrients(),
    staleTime: 1000 * 60 * 5,
  });
};
