import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyMember } from '@/types/family-space.type';

// 가족 스페이스 UI 상태 관리 (실제 필요한 상태만)

interface FamilySpaceUIState {
  // UI 설정 (지속성 필요)
  animationsEnabled: boolean;

  // 선택된 가족 구성원 (페이지 간 공유)
  selectedMember: FamilyMember | null;

  // 실시간 상호작용 상태 (페이지 간 공유)
  interactions: {
    isWatering: boolean;
    lastWateredBy: string | null;
    wateringCount: number;
  };
}

interface FamilySpaceUIActions {
  // UI 설정 액션
  toggleAnimations: () => void;

  // 가족 구성원 선택
  selectMember: (member: FamilyMember | null) => void;

  // 상호작용 액션
  startWatering: (memberId: string) => void;
  stopWatering: () => void;
  incrementWateringCount: () => void;

  // 초기화
  reset: () => void;
}

type FamilySpaceUIStore = FamilySpaceUIState & FamilySpaceUIActions;

// Zustand 스토어 생성 (페이지 간 공유 상태만)

export const useFamilySpaceUIStore = create<FamilySpaceUIStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      animationsEnabled: true,
      selectedMember: null,
      interactions: {
        isWatering: false,
        lastWateredBy: null,
        wateringCount: 0,
      },

      // UI 설정 액션
      toggleAnimations: () =>
        set((state) => ({
          animationsEnabled: !state.animationsEnabled,
        })),

      // 가족 구성원 선택
      selectMember: (member) => set({ selectedMember: member }),

      // 상호작용 액션
      startWatering: (memberId) =>
        set((state) => ({
          interactions: {
            ...state.interactions,
            isWatering: true,
            lastWateredBy: memberId,
          },
        })),

      stopWatering: () =>
        set((state) => ({
          interactions: {
            ...state.interactions,
            isWatering: false,
          },
        })),

      incrementWateringCount: () =>
        set((state) => ({
          interactions: {
            ...state.interactions,
            wateringCount: state.interactions.wateringCount + 1,
          },
        })),

      // 초기화 (UI 상태만)
      reset: () =>
        set({
          selectedMember: null,
          interactions: {
            isWatering: false,
            lastWateredBy: null,
            wateringCount: 0,
          },
        }),
    }),
    {
      name: 'family-space-ui-storage',
      // 지속성이 필요한 UI 설정만 저장
      partialize: (state) => ({
        animationsEnabled: state.animationsEnabled,
      }),
    }
  )
);

// 선택적 훅 (편의성)

// UI 설정만 필요한 경우
export const useUISettings = () =>
  useFamilySpaceUIStore((state) => ({
    animationsEnabled: state.animationsEnabled,
    toggleAnimations: state.toggleAnimations,
  }));

// 상호작용 상태만 필요한 경우
export const useInteractions = () =>
  useFamilySpaceUIStore((state) => ({
    interactions: state.interactions,
    startWatering: state.startWatering,
    stopWatering: state.stopWatering,
    incrementWateringCount: state.incrementWateringCount,
  }));

// 가족 구성원 선택 상태만 필요한 경우
export const useFamilyMemberSelection = () =>
  useFamilySpaceUIStore((state) => ({
    selectedMember: state.selectedMember,
    selectMember: state.selectMember,
  }));
