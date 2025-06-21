// types/survey.type.ts
export interface SurveyResultRequest {
  bugId: number; // 1~5
}

export type SurveyAnswer = {
  questionId: number;
  answerId: number;
};

export type SurveyResult = {
  type: string;
  description: string;
  recommendations: string[];
};

export interface SurveyResultResponse {
  bugId: number;
  bugName: string;
  feature: string;
  personality: string;
  suggest1: number; // 추천 요금제 ID 1
  suggest2: number; // 추천 요금제 ID 2
  benefit?: string; // 혜택 정보 (HTML 형태의 문자열)
}

// 📍 [추가] 유형별 bugId 매핑
export const typeToBugId: Record<string, number> = {
  개미형: 1,
  무당벌레형: 2,
  나비형: 3,
  장수풍뎅이형: 4,
  호박벌형: 5,
};
