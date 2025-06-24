import { useMemo } from 'react';

export * from './useFamilyQueries';
export * from './useFamilyMutations';

import {
  useFamilyData,
  useFamilyDashboard,
  useMessageCards,
  useMessageCardComments,
  useRecentMessageCardComments,
  useMessageCardCommentCount,
  useMemberCommentStatistics,
  useCardCommentStatistics,
} from './useFamilyQueries';
import {
  useCreateFamily,
  useJoinFamily,
  useLeaveFamily,
  useGenerateInviteCode,
  useUpdateFamilyName,
  useCreateMessageCard,
  useUpdateMessageCard,
  useDeleteMessageCard,
  useCreateMessageCardComment,
  useUpdateMessageCardComment,
  useDeleteMessageCardComment,
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
  const hasFamily = !!familyQuery.data;
  const messageCardsQuery = useMessageCards(hasFamily);

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
    createFamily: (data: any) => createMutation.mutateAsync(data),
    joinFamily: (data: any) => joinMutation.mutateAsync(data),
    leaveFamily: () => leaveMutation.mutateAsync(),
    generateNewCode: (fid: number) => generateCodeMutation.mutateAsync(fid),

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

/**
 * 메시지 카드 댓글 관련 기능을 통합한 훅
 */
export const useMessageCardCommentsManager = (fcid?: number) => {
  const commentsQuery = useMessageCardComments(fcid);
  const recentCommentsQuery = useRecentMessageCardComments(fcid);
  const commentCountQuery = useMessageCardCommentCount(fcid);
  const createMutation = useCreateMessageCardComment();
  const updateMutation = useUpdateMessageCardComment();
  const deleteMutation = useDeleteMessageCardComment();

  return {
    // 데이터
    comments: commentsQuery.data?.comments || [],
    totalCount: commentsQuery.data?.totalCount || 0,
    cardContent: commentsQuery.data?.cardContent || '',
    fcid: commentsQuery.data?.fcid,

    // 최근 댓글 (미리보기용)
    recentComments: recentCommentsQuery.data || [],

    // 댓글 개수
    commentCount: commentCountQuery.data?.commentCount || 0,

    // 로딩 상태
    isLoading: commentsQuery.isLoading,
    isLoadingRecent: recentCommentsQuery.isLoading,
    isLoadingCount: commentCountQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // 에러
    error: commentsQuery.error,
    recentError: recentCommentsQuery.error,
    countError: commentCountQuery.error,

    // 액션
    createComment: (data: { content: string }) => createMutation.mutate({ fcid: fcid!, data }),
    updateComment: (commentId: number, data: { content: string }) =>
      updateMutation.mutate({ fcid: fcid!, commentId, data }),
    deleteComment: (commentId: number) => deleteMutation.mutate({ fcid: fcid!, commentId }),

    // 유틸리티
    refetch: () => {
      commentsQuery.refetch();
      recentCommentsQuery.refetch();
      commentCountQuery.refetch();
    },
  };
};

/**
 * 댓글 통계 관련 기능을 통합한 훅
 */
export const useCommentStatisticsManager = () => {
  const memberStatsQuery = useMemberCommentStatistics();
  const cardStatsQuery = useCardCommentStatistics();

  return {
    // 데이터
    memberStatistics: memberStatsQuery.data || [],
    cardStatistics: cardStatsQuery.data || [],

    // 로딩 상태
    isLoadingMemberStats: memberStatsQuery.isLoading,
    isLoadingCardStats: cardStatsQuery.isLoading,

    // 에러
    memberStatsError: memberStatsQuery.error,
    cardStatsError: cardStatsQuery.error,

    // 유틸리티
    refetch: () => {
      memberStatsQuery.refetch();
      cardStatsQuery.refetch();
    },
  };
};
