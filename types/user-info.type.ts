export interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
  userType: string;
  joinDate: string;
  lastSurveyDate: string;
  completedMissions: number;
  familyMembers: number;
  bugId?: number;
  fid?: number;
  age?: string;
  plan_id?: number;
  uid?: number;
  hasRecommendedPlan?: boolean;
  // 필요한 경우 여기에 다른 필드도 추가하세요 (예: name, email 등)
}
