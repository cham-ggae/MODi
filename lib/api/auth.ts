import { apiClient, authenticatedApiClient } from './axios'
import { useAuthStore } from '@/store/useAuthStore'

/** 카카오 로그인 성공 응답 */
export interface LoginResponse {
    /** 사용자 이메일 */
    email: string
    /** 사용자 닉네임 */
    nickname: string
}

/** 카카오 콜백 요청 */
export interface KakaoCallbackRequest {
    /** 카카오에서 전달받은 인가 코드 */
    code: string
}

/**
 * 카카오 로그인 페이지로 리다이렉트
 */
export const startKakaoLogin = (): void => {
    window.location.href = `${process.env.NEXT_PUBLIC_ADDR}/authorize`
}

/**
 * 카카오 OAuth 콜백 처리
 */
export const handleKakaoCallback = async (code: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/kakao', { code })

    // Authorization 헤더에서 JWT 토큰 추출
    const authHeader = response.headers.authorization || response.headers.Authorization
    const accessToken = authHeader?.replace('Bearer ', '')

    if (!accessToken) {
        throw new Error('액세스 토큰을 받지 못했습니다')
    }

    // Zustand 스토어에 인증 정보 저장
    const { setAuth } = useAuthStore.getState()
    setAuth(accessToken, response.data)

    return response.data
}

/**
 * JWT 액세스 토큰 갱신
 */
export const refreshAccessToken = async (): Promise<string> => {
    const response = await apiClient.post('/refresh', {}, { withCredentials: true })

    // 새로운 액세스 토큰이 응답 헤더에 포함되어야 함
    const authHeader = response.headers.authorization || response.headers.Authorization
    const newToken = authHeader?.replace('Bearer ', '')

    if (!newToken) {
        // 바디에서도 확인
        if (response.data?.accessToken) {
            return response.data.accessToken
        }
        throw new Error('새로운 액세스 토큰을 받지 못했습니다')
    }

    return newToken
}

/**
 * 사용자 로그아웃 처리
 */
export const logout = async (): Promise<void> => {
    try {
        await authenticatedApiClient.post('/logout')
    } catch (error) {
        console.error('로그아웃 API 호출 실패:', error)
        // 서버 로그아웃 실패해도 로컬은 초기화
    } finally {
        // 로컬 상태 초기화 (항상 실행)
        const { clearAuth } = useAuthStore.getState()
        clearAuth()
    }
}

/**
 * 인증이 필요한 API 테스트
 */
export const testProtectedApi = async (): Promise<string> => {
    const response = await authenticatedApiClient.get<string>('/test')
    return response.data
}
