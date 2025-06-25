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
  handleClaimRewardClick: (params: {
    currentLevel: number;
    claimReward: (args: any, options: {
      onSuccess: (rewardData: RewardHistory) => void;
      onError: (error: any) => void;
    }) => void;
    confetti: (opts: any) => void;
  }) => void;
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
  handleClaimRewardClick: ({ currentLevel, claimReward, confetti }) => {
    if (currentLevel === 5) {
      claimReward(undefined, {
        onSuccess: (rewardData) => {
          set({ rewardData, showRewardModal: true });
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        },
        onError: () => { },
      });
    }
  },
})); 