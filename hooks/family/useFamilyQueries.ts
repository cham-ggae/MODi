import { useQuery } from '@tanstack/react-query';
import { familyApi } from '@/lib/api/family';
import { FamilyDashboardResponse } from '@/types/family.type';
import {
  MessageCardListResponse,
  MessageCard,
  MessageCardDetailResponse,
  ImageType,
} from '@/types/message-card.type';

/**
 * 내 가족 정보 조회 훅
 */
export const useFamilyData = () => {
  return useQuery({
    queryKey: ['family', 'my-family'],
    queryFn: familyApi.getMyFamily,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
    retry: (failureCount, error: any) => {
      // 204(가족 없음), 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [204, 403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * 특정 가족 대시보드 조회 훅
 */
export const useFamilyDashboard = (fid?: number) => {
  return useQuery({
    queryKey: ['family', 'dashboard', fid],
    queryFn: () => familyApi.getFamilyDashboard(fid!),
    enabled: !!fid,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * 초대 코드 검증 훅
 */
export const useValidateInviteCode = (inviteCode: string) => {
  return useQuery({
    queryKey: ['family', 'validate-invite', inviteCode],
    queryFn: () => familyApi.validateInviteCode(inviteCode),
    enabled: !!inviteCode && inviteCode.length === 6, // 6자리일 때만 검증
    retry: false, // 초대 코드 검증은 재시도하지 않음
    staleTime: 30 * 1000, // 30초
  });
};

/**
 * 가족 메시지 카드 목록 조회 훅
 */
export const useMessageCards = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['family', 'message-cards'],
    queryFn: familyApi.getMessageCards,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 3 * 60 * 1000, // 3분
    enabled, // 가족이 있을 때만 쿼리 활성화
    retry: (failureCount, error: any) => {
      // 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 최근 메시지 카드 조회 훅
 */
export const useRecentMessageCards = (limit: number = 10) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'recent', limit],
    queryFn: () => familyApi.getRecentMessageCards(limit),
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
  });
};

/**
 * 메시지 카드 상세 조회 훅
 */
export const useMessageCardDetail = (fcid?: number) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'detail', fcid],
    queryFn: () => familyApi.getMessageCardDetail(fcid!),
    enabled: !!fcid,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 이미지 카드 타입 목록 조회 훅
 */
export const useImageTypes = () => {
  return useQuery({
    queryKey: ['family', 'image-types'],
    queryFn: familyApi.getImageTypes,
    staleTime: 10 * 60 * 1000, // 10분 (자주 변경되지 않음)
    gcTime: 30 * 60 * 1000, // 30분
  });
};

/**
 * 메시지 카드 댓글 목록 조회 훅
 */
export const useMessageCardComments = (fcid?: number) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'comments', fcid],
    queryFn: () => familyApi.getMessageCardComments(fcid!),
    enabled: !!fcid,
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 3 * 60 * 1000, // 3분
    retry: (failureCount, error: any) => {
      // 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 메시지 카드 댓글 상세 조회 훅
 */
export const useMessageCardCommentDetail = (fcid?: number, commentId?: number) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'comments', 'detail', fcid, commentId],
    queryFn: () => familyApi.getMessageCardCommentDetail(fcid!, commentId!),
    enabled: !!fcid && !!commentId,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
    retry: (failureCount, error: any) => {
      // 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 메시지 카드 최근 댓글 조회 훅
 */
export const useRecentMessageCardComments = (fcid?: number, limit: number = 3) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'comments', 'recent', fcid, limit],
    queryFn: () => familyApi.getRecentMessageCardComments(fcid!, limit),
    enabled: !!fcid,
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
    retry: (failureCount, error: any) => {
      // 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 메시지 카드 댓글 개수 조회 훅
 */
export const useMessageCardCommentCount = (fcid?: number) => {
  return useQuery({
    queryKey: ['family', 'message-cards', 'comments', 'count', fcid],
    queryFn: () => familyApi.getMessageCardCommentCount(fcid!),
    enabled: !!fcid,
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
    retry: (failureCount, error: any) => {
      // 403(권한 없음), 404(없음)는 재시도하지 않음
      const noRetryStatuses = [403, 404];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 구성원별 댓글 통계 조회 훅
 */
export const useMemberCommentStatistics = () => {
  return useQuery({
    queryKey: ['family', 'comments', 'statistics', 'members'],
    queryFn: familyApi.getMemberCommentStatistics,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error: any) => {
      // 400(가족 스페이스 미가입), 403(권한 없음)는 재시도하지 않음
      const noRetryStatuses = [400, 403];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * 카드별 댓글 통계 조회 훅
 */
export const useCardCommentStatistics = () => {
  return useQuery({
    queryKey: ['family', 'comments', 'statistics', 'cards'],
    queryFn: familyApi.getCardCommentStatistics,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error: any) => {
      // 400(가족 스페이스 미가입), 403(권한 없음)는 재시도하지 않음
      const noRetryStatuses = [400, 403];
      if (noRetryStatuses.includes(error.response?.status)) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
