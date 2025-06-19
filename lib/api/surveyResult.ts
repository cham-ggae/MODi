import { authenticatedApiClient } from "./axios";
import type { SurveyResultRequest, SurveyResultResponse } from "@/types/survey.type";

export const surveyApi = {
  /**
   * 설문 결과 저장
   * POST /surveyResult
   */
  postSurveyResult: async (bugId: number): Promise<SurveyResultResponse> => {
    try {
      const response = await authenticatedApiClient.post(`/surveyResult?bugId=${bugId}`);
      return response.data;
    } catch (error) {
      console.error("설문 결과 저장 실패:", error);
      throw error;
    }
  },

  /**
   * 설문 결과 조회
   * GET /surveyResult/{bugId}
   */
  getSurveyResult: async (bugId: number): Promise<SurveyResultResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/surveyResult/${bugId}`);
      return response.data;
    } catch (error) {
      console.error("설문 결과 조회 실패:", error);
      throw error;
    }
  },
};
