import { create } from 'zustand';
import { RewardHistory } from '@/types/plants.type';

interface PlantGameState {
  showMissions: boolean;
  setShowMissions: (v: boolean) => void;
  showRewardModal: boolean;
  setShowRewardModal: (v: boolean) => void;
  rewardData: RewardHistory | null;
  setRewardData: (v: RewardHistory | null) => void;
  currentLevel: number;
  setCurrentLevel: (v: number) => void;
  currentProgress: number;
  setCurrentProgress: (v: number) => void;
}

export const usePlantGameStore = create<PlantGameState>((set) => ({
  showMissions: false,
  setShowMissions: (v) => set({ showMissions: v }),
  showRewardModal: false,
  setShowRewardModal: (v) => set({ showRewardModal: v }),
  rewardData: null,
  setRewardData: (v) => set({ rewardData: v }),
  currentLevel: 1,
  setCurrentLevel: (v) => set({ currentLevel: v }),
  currentProgress: 0,
  setCurrentProgress: (v) => set({ currentProgress: v }),
})); 