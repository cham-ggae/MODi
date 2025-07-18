// 식물 상태
export interface PlantStatus {
  level: number;
  experiencePoint: number;
  expThreshold: number; // 레벨업에 필요한 경험치
  completed: boolean;
  plantType: "flower" | "tree";
  nutrientCount?: number;
  completedCount?: number;
  createdAt?: string; // 식물 생성 날짜 (ISO 8601 형식, 백엔드 응답과 일치)
}

//식물 생성 시 나무 꽃 나누어 주어야 함
export interface CreatePlantRequest {
  plantType: "flower" | "tree";
  fid: number;
}

//현재 에러에 대한 메세지만 스웨거에 정의 에러 응답만 받아올 수 있게 정의
export interface ErrorResponse {
  message: string;
  statusCode?: number;
}

//히스토리 보상에 대한 타입 정의( 보상이름,설명,날짜)
export interface RewardHistory {
  rewardLogId: number;
  rewardId: number;
  rewardName: string;
  description: string;
  receivedAt: string;
  used: boolean; // 사용완료 여부
  memberName?: string; // 보상을 받은 구성원 이름 (가족별 조회 시)
  memberAvatar?: string; // 보상을 받은 구성원 아바타 (가족별 조회 시)
}

// 물주기 포인트 적립: POST /points/add -
export type ActivityType =
  | "attendance"
  | "water"
  | "nutrient"
  | "emotion"
  | "quiz"
  | "lastleaf"
  | "register"
  | "survey";

export interface AddPointRequestDto {
  activityType: ActivityType;
}

export interface WaterEventData {
  fid: number;
  uid: number;
  name: string;
  avatarUrl: string; // profile_image 와 연결됨
}

export interface PlantEventData {
  type: string; // 활동 타입 (예: "water", "quiz", "nutrient" 등)
  fid: number;
  uid: number;
  name: string;
  avatarUrl: string;
  level: number;
  experiencePoint: number;
  expThreshold: number;
  isLevelUp: boolean;
}
