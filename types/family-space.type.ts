export interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
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
