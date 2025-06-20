import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi } from '@/lib/api/family';
import { toast } from 'sonner'; // 또는 사용 중인 toast 라이브러리
import {
  CreateMessageCardRequest,
  UpdateMessageCardRequest,
  CreateMessageCardCommentRequest,
  UpdateMessageCardCommentRequest,
} from '@/types/message-card.type';

/**
 * 가족 생성 뮤테이션
 */
export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.createFamily,
    onSuccess: (data) => {
      // 가족 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['family'] });

      if (data.success) {
        toast.success(data.message || '가족 스페이스가 생성되었습니다!');
      } else {
        toast.error(data.message || '가족 생성에 실패했습니다.');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '가족 생성 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('가족 생성 에러:', error);
    },
  });
};

/**
 * 가족 참여 뮤테이션
 */
export const useJoinFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.joinFamily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['family'] });

      if (data.success) {
        toast.success(data.message || '가족에 성공적으로 참여했습니다!');
      } else {
        toast.error(data.message || '가족 참여에 실패했습니다.');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '가족 참여 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('가족 참여 에러:', error);
    },
  });
};

/**
 * 새 초대 코드 생성 뮤테이션
 */
export const useGenerateInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.generateNewInviteCode,
    onSuccess: (newCode, fid) => {
      // 해당 가족의 데이터 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'dashboard', fid] });
      queryClient.invalidateQueries({ queryKey: ['family', 'my-family'] });

      toast.success('새로운 초대 코드가 생성되었습니다!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '초대 코드 생성에 실패했습니다.';
      toast.error(message);
    },
  });
};

/**
 * 가족 탈퇴 뮤테이션
 */
export const useLeaveFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.leaveFamily,
    onSuccess: () => {
      // 모든 가족 관련 데이터 무효화
      queryClient.invalidateQueries({ queryKey: ['family'] });
      toast.success('가족에서 나왔습니다.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '가족 탈퇴에 실패했습니다.';
      toast.error(message);
    },
  });
};

// ==========================================
// 메시지 카드 관련 뮤테이션
// ==========================================

/**
 * 메시지 카드 생성 뮤테이션
 */
export const useCreateMessageCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.createMessageCard,
    onSuccess: (data) => {
      // 메시지 카드 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards'] });
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'recent'] });

      toast.success('메시지 카드가 생성되었습니다! 💌');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '메시지 카드 생성 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('메시지 카드 생성 에러:', error);
    },
  });
};

/**
 * 메시지 카드 수정 뮤테이션
 */
export const useUpdateMessageCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fcid, data }: { fcid: number; data: UpdateMessageCardRequest }) =>
      familyApi.updateMessageCard(fcid, data),
    onSuccess: (data, { fcid }) => {
      // 메시지 카드 목록 및 상세 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards'] });
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'recent'] });
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'detail', fcid] });

      toast.success('메시지 카드가 수정되었습니다! ✏️');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '메시지 카드 수정 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('메시지 카드 수정 에러:', error);
    },
  });
};

/**
 * 메시지 카드 삭제 뮤테이션
 */
export const useDeleteMessageCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.deleteMessageCard,
    onSuccess: (_, fcid) => {
      // 메시지 카드 목록 및 상세 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards'] });
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'recent'] });
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'detail', fcid] });

      toast.success('메시지 카드가 삭제되었습니다! 🗑️');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '메시지 카드 삭제 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('메시지 카드 삭제 에러:', error);
    },
  });
};

// ==========================================
// 메시지 카드 댓글 관련 뮤테이션
// ==========================================

/**
 * 메시지 카드 댓글 생성 뮤테이션
 */
export const useCreateMessageCardComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fcid, data }: { fcid: number; data: CreateMessageCardCommentRequest }) =>
      familyApi.createMessageCardComment(fcid, data),
    onSuccess: (data, { fcid }) => {
      // 댓글 관련 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'comments', fcid] });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'recent', fcid],
      });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'count', fcid],
      });
      queryClient.invalidateQueries({ queryKey: ['family', 'comments', 'statistics'] });

      toast.success('댓글이 작성되었습니다! 💬');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '댓글 작성 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('댓글 생성 에러:', error);
    },
  });
};

/**
 * 메시지 카드 댓글 수정 뮤테이션
 */
export const useUpdateMessageCardComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fcid,
      commentId,
      data,
    }: {
      fcid: number;
      commentId: number;
      data: UpdateMessageCardCommentRequest;
    }) => familyApi.updateMessageCardComment(fcid, commentId, data),
    onSuccess: (data, { fcid }) => {
      // 댓글 관련 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'comments', fcid] });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'recent', fcid],
      });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'detail', fcid],
      });

      toast.success('댓글이 수정되었습니다! ✏️');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '댓글 수정 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('댓글 수정 에러:', error);
    },
  });
};

/**
 * 메시지 카드 댓글 삭제 뮤테이션
 */
export const useDeleteMessageCardComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fcid, commentId }: { fcid: number; commentId: number }) =>
      familyApi.deleteMessageCardComment(fcid, commentId),
    onSuccess: (_, { fcid }) => {
      // 댓글 관련 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['family', 'message-cards', 'comments', fcid] });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'recent', fcid],
      });
      queryClient.invalidateQueries({
        queryKey: ['family', 'message-cards', 'comments', 'count', fcid],
      });
      queryClient.invalidateQueries({ queryKey: ['family', 'comments', 'statistics'] });

      toast.success('댓글이 삭제되었습니다! 🗑️');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '댓글 삭제 중 오류가 발생했습니다.';
      toast.error(message);
      console.error('댓글 삭제 에러:', error);
    },
  });
};
