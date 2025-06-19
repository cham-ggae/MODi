export interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  profileImage?: string;
  plan: string;
  hasRecommendation: boolean;
}

export type PlantType = 'flower' | 'tree';

export interface PlantData {
  hasPlant: boolean;
  plantType?: PlantType;
}

export interface InviteData {
  inviteCode: string;
  familyName: string;
}
