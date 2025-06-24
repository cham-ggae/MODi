/**
 * 메시지 카드 관련 타입 정의
 * 가족 스페이스 내 메시지 카드 기능에 사용되는 모든 타입
 */

/**
 * 메시지 카드 기본 정보
 * Family_cards 테이블과 매핑되는 엔티티
 */
export interface MessageCard {
  /** 메시지 카드 고유 ID (Primary Key) */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL (선택적) */
  authorProfileImage?: string;

  /** 카드 이미지 타입 (heart, flower, star 등) */
  imageType: string;

  /** 카드 이미지 설명 (백엔드에서 자동 생성) */
  imageDescription: string;

  /** 메시지 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 목록 조회 응답
 */
export interface MessageCardListResponse {
  /** 메시지 카드 목록 */
  cards: MessageCard[];

  /** 총 카드 수 */
  totalCount: number;

  /** 가족 ID */
  familyId: number;

  /** 가족 이름 */
  familyName: string;
}

/**
 * 메시지 카드 생성 요청
 */
export interface CreateMessageCardRequest {
  /** 카드 이미지 타입 */
  imageType: string;

  /** 메시지 내용 */
  content: string;
}

/**
 * 메시지 카드 생성 응답
 */
export interface CreateMessageCardResponse {
  /** 메시지 카드 고유 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 카드 이미지 타입 */
  imageType: string;

  /** 카드 이미지 설명 */
  imageDescription: string;

  /** 메시지 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 수정 요청
 */
export interface UpdateMessageCardRequest {
  /** 카드 이미지 타입 */
  imageType: string;

  /** 메시지 내용 */
  content: string;
}

/**
 * 메시지 카드 수정 응답
 */
export interface UpdateMessageCardResponse {
  /** 메시지 카드 고유 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 카드 이미지 타입 */
  imageType: string;

  /** 카드 이미지 설명 */
  imageDescription: string;

  /** 메시지 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 상세 조회 응답
 */
export interface MessageCardDetailResponse {
  /** 메시지 카드 고유 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 카드 이미지 타입 */
  imageType: string;

  /** 카드 이미지 설명 */
  imageDescription: string;

  /** 메시지 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 이미지 카드 타입 정보
 */
export interface ImageType {
  /** 이미지 타입 코드 */
  code: string;

  /** 이미지 타입 설명 */
  description: string;
}

/**
 * 메시지 카드 댓글
 */
export interface MessageCardComment {
  /** 댓글 고유 ID */
  commentId: number;

  /** 메시지 카드 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 댓글 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 댓글 목록 조회 응답
 */
export interface MessageCardCommentsResponse {
  /** 댓글 목록 */
  comments: MessageCardComment[];

  /** 총 댓글 수 */
  totalCount: number;

  /** 메시지 카드 ID */
  fcid: number;

  /** 메시지 카드 내용 */
  cardContent: string;
}

/**
 * 메시지 카드 댓글 생성 요청
 */
export interface CreateMessageCardCommentRequest {
  /** 댓글 내용 */
  content: string;
}

/**
 * 메시지 카드 댓글 생성 응답
 */
export interface CreateMessageCardCommentResponse {
  /** 댓글 고유 ID */
  commentId: number;

  /** 메시지 카드 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 댓글 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 댓글 수정 요청
 */
export interface UpdateMessageCardCommentRequest {
  /** 댓글 내용 */
  content: string;
}

/**
 * 메시지 카드 댓글 수정 응답
 */
export interface UpdateMessageCardCommentResponse {
  /** 댓글 고유 ID */
  commentId: number;

  /** 메시지 카드 ID */
  fcid: number;

  /** 작성자 사용자 ID */
  uid: number;

  /** 작성자 이름 */
  authorName: string;

  /** 작성자 프로필 이미지 URL */
  authorProfileImage?: string;

  /** 댓글 내용 */
  content: string;

  /** 생성일시 */
  createdAt: string;

  /** 수정 권한 여부 */
  canModify: boolean;

  /** 삭제 권한 여부 */
  canDelete: boolean;
}

/**
 * 메시지 카드 이미지 타입 상수
 */
export const MESSAGE_CARD_IMAGE_TYPES = {
  HEART: 'heart',
  FLOWER: 'flower',
  STAR: 'star',
  GIFT: 'gift',
  COFFEE: 'coffee',
  SUN: 'sun',
} as const;

/**
 * 메시지 카드 이미지 타입 유니온
 */
export type MessageCardImageType =
  (typeof MESSAGE_CARD_IMAGE_TYPES)[keyof typeof MESSAGE_CARD_IMAGE_TYPES];

/**
 * 댓글 개수 조회 응답
 */
export interface CommentCountResponse {
  /** 메시지 카드 ID */
  fcid: number;

  /** 댓글 개수 */
  commentCount: number;
}

/**
 * 구성원별 댓글 통계
 */
export interface MemberCommentStatistics {
  /** 구성원 ID */
  memberId: number;

  /** 구성원 이름 */
  memberName: string;

  /** 댓글 작성 개수 */
  commentCount: number;

  /** 마지막 댓글 작성일 */
  lastCommentDate: string;
}

/**
 * 카드별 댓글 통계
 */
export interface CardCommentStatistics {
  /** 카드 ID */
  cardId: number;

  /** 카드 내용 */
  cardContent: string;

  /** 댓글 개수 */
  commentCount: number;

  /** 마지막 댓글 작성일 */
  lastCommentDate: string;
}
