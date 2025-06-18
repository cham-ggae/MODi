/**
 * 가족 스페이스 기본 정보
 * Family_space 테이블과 매핑되는 엔티티
 */
export interface FamilySpace {
    /** 가족 스페이스 고유 ID (Primary Key) */
    fid: number

    /**
     * 가족 스페이스 이름
     * 사용자가 지정하는 가족명 (예: "우리가족", "김씨네 가족")
     * 최대 30자까지 저장 가능
     */
    name: string

    /**
     * 가족 초대 코드
     * 가족 구성원 초대 시 사용하는 고유 코드
     * 영문 대문자 + 숫자 조합으로 생성 (예: "A1B2C3")
     * 고정 6자리
     */
    inviteCode: string

    /**
     * 가족 결합 상품 타입
     * 할인 계산에 사용되는 결합 상품 종류
     * 가능한 값: "투게더 결합", "참쉬운 가족 결합", "가족 무한 사랑"
     */
    combiType: string

    /**
     * 새싹 키우기 영양제 수량
     * 가족 활동을 통해 획득하는 영양제 개수
     * 식물 성장 시스템에서 사용
     */
    nutrial: number

    /**
     * 가족 스페이스 생성일시
     * ISO 8601 형식의 문자열 (예: "2025-06-16T10:30:00Z")
     * 자동으로 현재 시간이 설정됨
     */
    createdAt: string

    /**
     * 가족 스페이스 생성 후 경과 일수 (선택적)
     * 백엔드에서 계산되어 전달되는 필드
     * UI 표시 및 가족 등급 산정에 사용
     * 예: 30일째 함께하는 가족
     */
    daysAfterCreation?: number
}

/**
 * 가족 구성원 정보
 * Users 테이블과 Plans 테이블을 LEFT JOIN한 결과와 매핑
 * 가족 스페이스 대시보드에서 구성원 정보 표시에 사용
 */
export interface FamilyMember {
    /**
     * 사용자 고유 ID (Primary Key)
     * Users.uid와 매핑
     */
    uid: number

    /**
     * 사용자 이름
     * 카카오 로그인 시 제공되는 이름 또는 사용자 입력 이름
     * 최대 15자까지 저장 가능
     */
    name: string

    /**
     * 사용자 나이 (선택적)
     * 형식 : 20~29 문자열
     * NULL 가능 (선택적 입력)
     */
    age?: string

    /**
     * 사용자 성별 (선택적)
     * 요금제 추천 시 참고 데이터로 사용
     * 가능한 값: "male", "female", null
     * 최대 10자까지 저장 가능
     */
    gender?: string

    /**
     * 서비스 가입일시
     * ISO 8601 형식의 문자열
     * 장기 고객 할인 계산 기준일
     * 자동으로 현재 시간이 설정됨
     */
    joinDate: string

    // 요금제 정보 (Plans 테이블 - LEFT JOIN으로 NULL 가능)

    /**
     * 현재 사용 중인 요금제 ID (선택적)
     * Plans.plan_id와 매핑
     * NULL인 경우 요금제 미가입 상태
     */
    planId?: number

    /**
     * 요금제 이름 (선택적)
     * 예: "5G 시그니처", "5G 스탠다드", "5G 프리미어" 등
     * NULL인 경우 요금제 미가입 상태
     */
    planName?: string

    /**
     * 요금제 월 이용료 (원) (선택적)
     * 할인 전 기본 요금
     * NULL인 경우 요금제 미가입 상태
     */
    price?: number

    /**
     * 요금제 혜택 설명 (선택적)
     * 데이터, 통화, 문자 등의 제공 내용
     * 최대 150자까지 저장 가능
     */
    benefit?: string

    /**
     * 현재 데이터 사용량 표시용 (선택적)
     * 예: "45GB", "23GB", "무제한" 등
     * 실제 사용량은 외부 API에서 조회하거나 하드코딩
     * UI에서 시각적 표시를 위해 사용
     */
    dataUsage?: string

    /**
     * 사용자 프로필 이미지 URL (선택적)
     * 카카오 로그인 시 제공되는 프로필 이미지
     * 또는 사용자가 업로드한 이미지
     */
    profileImage?: string

    /**
     * 요금제 요약 정보 (선택적)
     * UI 표시용으로 백엔드에서 생성
     * 예: "5G 시그니처 (월 89,000원)"
     * 요금제가 없는 경우: "요금제 없음"
     */
    planSummary?: string
}

/**
 * 가족 스페이스 대시보드 응답 데이터
 * 메인 대시보드 페이지에서 사용하는 모든 정보를 포함
 */
export interface FamilyDashboardResponse {
    /** 가족 스페이스 기본 정보 */
    family: FamilySpace

    /** 가족 구성원 목록 (요금제 정보 포함) */
    members: FamilyMember[]

    /**
     * 총 가족 구성원 수
     * members.length와 동일하지만 편의성을 위해 제공
     */
    totalMembers: number

    /**
     * 요금제를 가입한 구성원 수
     * 할인 계산 및 통계에 사용
     */
    membersWithPlan: number
}

/**
 * 가족 스페이스 생성 요청 데이터
 */
export interface CreateFamilyRequest {
    /**
     * 가족 이름 (1~30자)
     * 필수 입력값
     */
    name: string

    /**
     * 결합 상품 타입
     * 할인 혜택을 결정하는 중요한 값
     */
    combiType: '투게더 결합' | '참쉬운 가족 결합' | '가족 무한 사랑'
}

/**
 * 가족 스페이스 생성/참여 응답 데이터
 */
export interface CreateFamilyResponse {
    /** 요청 성공 여부 */
    success: boolean

    /**
     * 응답 메시지
     * 성공/실패 사유를 사용자에게 표시
     */
    message: string

    /**
     * 생성/참여된 가족 스페이스 정보 (선택적)
     * 성공한 경우에만 제공
     */
    family?: FamilySpace
}

/**
 * 가족 참여 요청 데이터 (초대 코드로 가족 참여)
 */
export interface JoinFamilyRequest {
    /**
     * 가족 초대 코드 (6자리 영문 대문자 + 숫자)
     * 예: "A1B2C3", "X9Y8Z7"
     */
    inviteCode: string
}

/**
 * 가족 기본 정보
 * 초대 코드 검증 시 표시용 간소화된 가족 정보
 */
export interface FamilyInfo {
    /** 가족 스페이스 ID */
    fid: number

    /** 가족 이름 */
    name: string

    /** 현재 구성원 수 (최대 5명) */
    memberCount: number

    /** 결합 상품 타입 */
    combiType: string
}

/**
 * 초대 코드 검증 응답 데이터
 */
export interface InviteCodeValidationResponse {
    /** 초대 코드 유효성 여부 */
    valid: boolean

    /**
     * 검증 실패 시 오류 메시지 (선택적)
     * 예: "유효하지 않은 초대 코드입니다", "가족 구성원이 가득 찼습니다"
     */
    error?: string

    /**
     * 유효한 경우 가족 기본 정보 (선택적)
     * 사용자가 참여하려는 가족의 정보를 미리 보여줌
     */
    familyInfo?: FamilyInfo
}

/**
 * 할인 정보 계산 결과
 * 가족 결합 할인 혜택을 표시하기 위한 데이터
 */
export interface DiscountInfo {
    /**
     * 총 월 할인 금액 (원)
     * 예: 52000
     */
    totalMonthly: number

    /**
     * 할인 설명 문구
     * 예: "투게더 결합 이용 시 한달에 최대 52,000원 아낄 수 있어요!"
     */
    description: string

    /** 할인 계산 기준 구성원 수 */
    memberCount: number

    /**
     * 청소년 할인 대상자 수 (선택적)
     * 19세 미만 구성원 수
     */
    youthDiscountCount?: number

    /**
     * 기본 할인 금액 (선택적)
     * 인당 14,000원 × 구성원 수
     */
    baseDiscount?: number

    /**
     * 청소년 추가 할인 금액 (선택적)
     * 청소년 1명당 10,000원 추가
     */
    youthDiscount?: number
}

/**
 * API 에러 응답 타입
 * 백엔드에서 발생하는 에러를 표준화된 형태로 처리
 */
export interface ApiError {
    /** 에러 메시지 */
    message: string

    /** HTTP 상태 코드 (선택적) */
    status?: number

    /**
     * 에러 코드 (선택적)
     * 예: "FAMILY_NOT_FOUND", "INVALID_INVITE_CODE"
     */
    code?: string

    /**
     * 추가 에러 정보 (선택적)
     * 디버깅이나 상세 처리를 위한 데이터
     */
    details?: Record<string, any>
}

/**
 * 가족 구성원 역할 타입 (향후 확장용)
 */
export type FamilyRole = 'OWNER' | 'MEMBER'

/**
 * 가족 스페이스 상태 타입 (향후 확장용)
 */
export type FamilyStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

/**
 * 결합 상품 타입 상수
 */
export const COMBI_TYPES = {
    TOGETHER: '투게더 결합',
    EASY_FAMILY: '참쉬운 가족 결합',
    UNLIMITED_LOVE: '가족 무한 사랑'
} as const

/**
 * 결합 상품 타입 유니온
 */
export type CombiType = typeof COMBI_TYPES[keyof typeof COMBI_TYPES]

/**
 * 가족 구성원 최대 제한
 */
export const FAMILY_MEMBER_LIMIT = 5

/**
 * 초대 코드 길이
 */
export const INVITE_CODE_LENGTH = 6
