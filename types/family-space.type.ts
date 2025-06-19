/**
 * 가족 스페이스 관련 타입 정의
 * 가족 스페이스 UI 및 컴포넌트에서 사용되는 타입들
 */

export type PlantType = 'flower' | 'tree';

export interface PlantData {
  hasPlant: boolean;
  plantType?: PlantType;
}

export interface InviteData {
  inviteCode: string;
  familyName: string;
}
