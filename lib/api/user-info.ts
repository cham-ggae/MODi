import { authenticatedApiClient } from "./axios";

/**
 * 내 정보 조회 (GET /user)
 */
export const getMyUserInfo = async () => {
  const response = await authenticatedApiClient.get("/user");
  return response.data;
};
