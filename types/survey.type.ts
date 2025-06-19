// types/survey.type.ts
export interface SurveyResultRequest {
  bugId: number; // 1~5
}

export interface SurveyResultResponse {
  success: boolean;
  message: string;
  // 필요시 결과 데이터 추가
}
