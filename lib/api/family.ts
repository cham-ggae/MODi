import { authenticatedApiClient } from './axios';
import type {
  FamilySpace,
  FamilyDashboardResponse,
  CreateFamilyRequest,
  CreateFamilyResponse,
  InviteCodeValidationResponse,
  JoinFamilyRequest,
} from '@/types/family.type';
import type {
  MessageCardListResponse,
  CreateMessageCardRequest,
  CreateMessageCardResponse,
  UpdateMessageCardRequest,
  UpdateMessageCardResponse,
  MessageCardDetailResponse,
  ImageType,
  MessageCard,
  MessageCardCommentsResponse,
  CreateMessageCardCommentRequest,
  CreateMessageCardCommentResponse,
  UpdateMessageCardCommentRequest,
  UpdateMessageCardCommentResponse,
  MessageCardComment,
  CommentCountResponse,
  MemberCommentStatistics,
  CardCommentStatistics,
} from '@/types/message-card.type';

export const familyApi = {
  /**
   * 내 가족 정보 조회
   * GET /family
   */
  getMyFamily: async (): Promise<FamilyDashboardResponse | null> => {
    try {
      const response = await authenticatedApiClient.get('/family');
      return response.data;
    } catch (error: any) {
      // 204 No Content: 가족에 속해있지 않음
      if (error.response?.status === 204) {
        return null;
      }
      console.error('내 가족 정보 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 가족 대시보드 조회
   * GET /family/{fid}
   */
  getFamilyDashboard: async (fid: number): Promise<FamilyDashboardResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/family/${fid}`);
      return response.data;
    } catch (error) {
      console.error('가족 대시보드 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 가족 스페이스 생성
   * POST /family
   */
  createFamily: async (data: CreateFamilyRequest): Promise<CreateFamilyResponse> => {
    try {
      const response = await authenticatedApiClient.post('/family', data);
      return response.data;
    } catch (error) {
      console.error('가족 스페이스 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 가족 참여
   * POST /family/join
   */
  joinFamily: async (data: JoinFamilyRequest): Promise<CreateFamilyResponse> => {
    try {
      const response = await authenticatedApiClient.post('/family/join', data);
      return response.data;
    } catch (error) {
      console.error('가족 참여 실패:', error);
      throw error;
    }
  },

  /**
   * 가족 탈퇴
   * POST /family/leave
   */
  leaveFamily: async (): Promise<void> => {
    try {
      await authenticatedApiClient.post('/family/leave');
    } catch (error) {
      console.error('가족 탈퇴 실패:', error);
      throw error;
    }
  },

  /**
   * 초대 코드 검증
   * GET /family/validate-invite/{inviteCode}
   */
  validateInviteCode: async (inviteCode: string): Promise<InviteCodeValidationResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/family/validate-invite/${inviteCode}`);
      return response.data;
    } catch (error) {
      console.error('초대 코드 검증 실패:', error);
      throw error;
    }
  },

  /**
   * 새 초대 코드 생성
   * POST /family/{fid}/invite-code
   */
  generateNewInviteCode: async (fid: number): Promise<string> => {
    try {
      const response = await authenticatedApiClient.post(`/family/${fid}/invite-code`);
      return response.data.inviteCode;
    } catch (error) {
      console.error('초대 코드 생성 실패:', error);
      throw error;
    }
  },

  // ==========================================
  // 메시지 카드 관련 API
  // ==========================================

  /**
   * 가족 메시지 카드 목록 조회
   * GET /family/cards
   */
  getMessageCards: async (): Promise<MessageCardListResponse> => {
    try {
      const response = await authenticatedApiClient.get('/family/cards');
      return response.data;
    } catch (error) {
      console.error('메시지 카드 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 최근 메시지 카드 조회
   * GET /family/cards/recent?limit={limit}
   */
  getRecentMessageCards: async (limit: number = 10): Promise<MessageCard[]> => {
    try {
      const response = await authenticatedApiClient.get(`/family/cards/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('최근 메시지 카드 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 상세 조회
   * GET /family/cards/{fcid}
   */
  getMessageCardDetail: async (fcid: number): Promise<MessageCardDetailResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/family/cards/${fcid}`);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 상세 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 이미지 카드 타입 목록 조회
   * GET /family/cards/image-types
   */
  getImageTypes: async (): Promise<ImageType[]> => {
    try {
      const response = await authenticatedApiClient.get('/family/cards/image-types');
      return response.data;
    } catch (error) {
      console.error('이미지 타입 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 생성
   * POST /family/cards
   */
  createMessageCard: async (data: CreateMessageCardRequest): Promise<CreateMessageCardResponse> => {
    try {
      const response = await authenticatedApiClient.post('/family/cards', data);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 수정
   * PUT /family/cards/{fcid}
   */
  updateMessageCard: async (
    fcid: number,
    data: UpdateMessageCardRequest
  ): Promise<UpdateMessageCardResponse> => {
    try {
      const response = await authenticatedApiClient.put(`/family/cards/${fcid}`, data);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 삭제
   * DELETE /family/cards/{fcid}
   */
  deleteMessageCard: async (fcid: number): Promise<void> => {
    try {
      await authenticatedApiClient.delete(`/family/cards/${fcid}`);
    } catch (error) {
      console.error('메시지 카드 삭제 실패:', error);
      throw error;
    }
  },

  // ==========================================
  // 메시지 카드 댓글 관련 API
  // ==========================================

  /**
   * 메시지 카드 댓글 목록 조회
   * GET /family/cards/{fcid}/comments
   */
  getMessageCardComments: async (fcid: number): Promise<MessageCardCommentsResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/family/cards/${fcid}/comments`);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 댓글 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 댓글 생성
   * POST /family/cards/{fcid}/comments
   */
  createMessageCardComment: async (
    fcid: number,
    data: CreateMessageCardCommentRequest
  ): Promise<CreateMessageCardCommentResponse> => {
    try {
      const response = await authenticatedApiClient.post(`/family/cards/${fcid}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 댓글 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 댓글 수정
   * PUT /family/cards/{fcid}/comments/{commentId}
   */
  updateMessageCardComment: async (
    fcid: number,
    commentId: number,
    data: UpdateMessageCardCommentRequest
  ): Promise<UpdateMessageCardCommentResponse> => {
    try {
      const response = await authenticatedApiClient.put(
        `/family/cards/${fcid}/comments/${commentId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('메시지 카드 댓글 수정 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 댓글 삭제
   * DELETE /family/cards/{fcid}/comments/{commentId}
   */
  deleteMessageCardComment: async (fcid: number, commentId: number): Promise<void> => {
    try {
      await authenticatedApiClient.delete(`/family/cards/${fcid}/comments/${commentId}`);
    } catch (error) {
      console.error('메시지 카드 댓글 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 댓글 상세 조회
   * GET /family/cards/{fcid}/comments/{commentId}
   */
  getMessageCardCommentDetail: async (
    fcid: number,
    commentId: number
  ): Promise<MessageCardComment> => {
    try {
      const response = await authenticatedApiClient.get(
        `/family/cards/${fcid}/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      console.error('메시지 카드 댓글 상세 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 최근 댓글 조회
   * GET /family/cards/{fcid}/comments/recent?limit={limit}
   */
  getRecentMessageCardComments: async (
    fcid: number,
    limit: number = 3
  ): Promise<MessageCardComment[]> => {
    try {
      const response = await authenticatedApiClient.get(
        `/family/cards/${fcid}/comments/recent?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('메시지 카드 최근 댓글 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 메시지 카드 댓글 개수 조회
   * GET /family/cards/{fcid}/comments/count
   */
  getMessageCardCommentCount: async (fcid: number): Promise<CommentCountResponse> => {
    try {
      const response = await authenticatedApiClient.get(`/family/cards/${fcid}/comments/count`);
      return response.data;
    } catch (error) {
      console.error('메시지 카드 댓글 개수 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 구성원별 댓글 통계 조회
   * GET /family/comments/statistics/members
   */
  getMemberCommentStatistics: async (): Promise<MemberCommentStatistics[]> => {
    try {
      const response = await authenticatedApiClient.get('/family/comments/statistics/members');
      return response.data;
    } catch (error) {
      console.error('구성원별 댓글 통계 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 카드별 댓글 통계 조회
   * GET /family/comments/statistics/cards
   */
  getCardCommentStatistics: async (): Promise<CardCommentStatistics[]> => {
    try {
      const response = await authenticatedApiClient.get('/family/comments/statistics/cards');
      return response.data;
    } catch (error) {
      console.error('카드별 댓글 통계 조회 실패:', error);
      throw error;
    }
  },
};
