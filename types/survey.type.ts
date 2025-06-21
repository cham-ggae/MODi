// types/survey.type.ts

// 설문 결과 요청 시 사용하는 API 요청 타입
export interface SurveyResultRequest {
  bugId: number; // 1~5
}

// 설문 응답 1개에 대한 타입 (선택지 기준 저장용)
export type SurveyAnswer = {
  questionId: number;
  answerId: number;
};

// 분석된 설문 결과의 요약 형태
export type SurveyResult = {
  type: string;
  description: string;
  recommendations: string[];
};

// 백엔드에서 전달받는 설문 결과 응답 데이터 구조
export interface SurveyResultResponse {
  bugId: number;
  bugName: string; // DB상의 원시 유형명 (예: 장수풍뎅이)
  feature: string; // 요약 설명
  personality: string; // 감성형 문구
  suggest1: number; // 추천 요금제 ID 1
  suggest2: number; // 추천 요금제 ID 2
  benefit?: string; // 혜택 정보 (HTML 형태의 문자열)
}

//  DB에서 사용하는 bugName을 프론트 UI에서의 이름으로 매핑
// 예: '장수풍뎅이' → '개미형'
export const bugNameUiMap: Record<string, string> = {
  호박벌: "호박벌형",
  무당벌레: "무당벌레형",
  개미: "라바형", // DB의 '개미'는 라바형으로 사용
  나비: "나비형",
  장수풍뎅이: "개미형", // '장수풍뎅이'가 UI에서는 '개미형'으로 표시됨
};

// 프론트에서 사용하는 UI 표시 이름 → 백엔드용 bugId로 매핑
export const typeToBugId: Record<string, number> = {
  호박벌형: 1,
  무당벌레형: 2,
  라바형: 3,
  나비형: 4,
  개미형: 5,
};

// 📍 [리팩토링] 사용자 유형 정보에 대한 타입 정의
export interface UserType {
  type: string; // 유형 이름 (ex. 호박벌형)
  emoji: string; // 이모지
  title: string; // 유형별 타이틀 문구
  description: string; // 특징 설명
  recommendations: string[]; // 추천 요금제 이름
  savings: number; // 절약 가능 금액
  message: string; // 하단 메시지
}
