import { useMemo } from 'react';

export * from './useFamilyQueries';
export * from './useFamilyMutations';

import { useFamilyData, useFamilyDashboard, useMessageCards } from './useFamilyQueries';
import {
  useCreateFamily,
  useJoinFamily,
  useLeaveFamily,
  useGenerateInviteCode,
  useCreateMessageCard,
  useUpdateMessageCard,
  useDeleteMessageCard,
} from './useFamilyMutations';

/**
 * 가족 관련 모든 기능을 통합한 훅
 */
export const useFamily = () => {
  const familyQuery = useFamilyData();
  const createMutation = useCreateFamily();
  const joinMutation = useJoinFamily();
  const leaveMutation = useLeaveFamily();
  const generateCodeMutation = useGenerateInviteCode();

  // 현재 가족 ID 추출
  const currentFamilyId = familyQuery.data?.family?.fid;
  const dashboardQuery = useFamilyDashboard(currentFamilyId);
  const messageCardsQuery = useMessageCards();

  const derivedState = useMemo(
    () => ({
      hasFamily: !!familyQuery.data,
      familyId: familyQuery.data?.family?.fid,
      memberCount: familyQuery.data?.members?.length || 0,
      canInvite: (familyQuery.data?.members?.length || 0) < 5,
    }),
    [familyQuery.data]
  );

  return {
    // 데이터
    ...derivedState,
    family: familyQuery.data,
    dashboard: dashboardQuery.data,
    messageCards: messageCardsQuery.data,

    // 로딩 상태
    isLoading: familyQuery.isLoading || dashboardQuery.isLoading,
    isCreating: createMutation.isPending,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    isGeneratingCode: generateCodeMutation.isPending,
    isLoadingMessageCards: messageCardsQuery.isLoading,

    // 에러
    error: familyQuery.error || dashboardQuery.error,
    messageCardsError: messageCardsQuery.error,

    // 액션
    createFamily: createMutation.mutate,
    joinFamily: joinMutation.mutate,
    leaveFamily: leaveMutation.mutate,
    generateNewCode: generateCodeMutation.mutate,

    // 상태
    hasFamily: !!familyQuery.data,
    familyId: currentFamilyId,

    // 유틸리티
    refetch: () => {
      familyQuery.refetch();
      if (currentFamilyId) {
        dashboardQuery.refetch();
      }
      messageCardsQuery.refetch();
    },
  };
};

/**
 * 메시지 카드 관련 기능을 통합한 훅
 */
export const useMessageCardsManager = () => {
  const messageCardsQuery = useMessageCards();
  const createMutation = useCreateMessageCard();
  const updateMutation = useUpdateMessageCard();
  const deleteMutation = useDeleteMessageCard();

  return {
    // 데이터
    messageCards: messageCardsQuery.data?.cards || [],
    totalCount: messageCardsQuery.data?.totalCount || 0,
    familyId: messageCardsQuery.data?.familyId,
    familyName: messageCardsQuery.data?.familyName,

    // 로딩 상태
    isLoading: messageCardsQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // 에러
    error: messageCardsQuery.error,

    // 액션
    createMessageCard: createMutation.mutate,
    updateMessageCard: updateMutation.mutate,
    deleteMessageCard: deleteMutation.mutate,

    // 유틸리티
    refetch: () => messageCardsQuery.refetch(),
  };
};
