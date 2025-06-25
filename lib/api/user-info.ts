import { authenticatedApiClient } from "./axios";
import { UserInfo } from "@/types/user-info.type";

/**
 * 내 정보 조회 (GET /user)
 */
export const getMyUserInfo = async (): Promise<UserInfo> => {
  const response = await authenticatedApiClient.get("/user");
  return response.data;
};
