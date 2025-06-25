import { useQuery } from "@tanstack/react-query";
import { getMyUserInfo } from "@/lib/api/user-info";
import { UserInfo } from "@/types/user-info.type";

/**
 * 내 user 정보 조회 쿼리 (GET /user)
 */
export const useMyUserInfo = () => {
  return useQuery<UserInfo>({
    queryKey: ["user", "me"],
    queryFn: getMyUserInfo,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
};
