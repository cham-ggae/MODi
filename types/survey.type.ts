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

// 📍 [추가] DB bug_name을 UI 표시 이름으로 매핑
export const bugNameUiMap: Record<string, string> = {
  호박벌: "호박벌형",
  무당벌레: "무당벌레형",
  개미: "라바형",
  나비: "나비형",
  장수풍뎅이: "개미형",
};

// 📍 [수정] UI 이름 기준으로 bugId 매핑
export const typeToBugId: Record<string, number> = {
  호박벌형: 1,
  무당벌레형: 2,
  라바형: 3,
  나비형: 4,
  개미형: 5,
};
