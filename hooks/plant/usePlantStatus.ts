import { plantApi } from '@/lib/api/plant';
import { useQuery } from '@tanstack/react-query';

export const usePlantStatus = (fid: number) => {
  return useQuery({
    queryKey: ['plant', 'status', fid],
    queryFn: () => plantApi.getPlantStatus(fid),
    enabled: !!fid && fid > 0, // familyId가 유효한 값일 때만 실행
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      // 403 에러는 재시도하지 않음 (식물이 없거나 권한 없음)
      if (error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
