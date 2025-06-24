import { authenticatedApiClient } from "./axios";

export const mypageApi = {
  /**
   * 추천 요금제 히스토리 조회
   * GET /mypage/history
   */
  getHistory: async () => {
    const response = await authenticatedApiClient.get("/mypage/history");
    return response.data;
  },
};
