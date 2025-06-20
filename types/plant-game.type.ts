export interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  hasWatered: boolean;
  status: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  icon: string;
  reward: string;
  activityType: import("./plants.type").ActivityType;
}
