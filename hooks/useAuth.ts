import { useAuthStore } from '@/store/useAuthStore'
import { startKakaoLogin, logout as apiLogout } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

/**
 * 인증 관련 상태와 액션을 제공하는 커스텀 훅
 */
export const useAuth = () => {
    const router = useRouter()
    const {
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        clearAuth,
        setLoading
    } = useAuthStore()

    /**
     * 카카오 로그인 시작
     */
    const login = () => {
        startKakaoLogin()
    }

    /**
     * 사용자 로그아웃 처리
     */
    const logout = async () => {
        setLoading(true)
        try {
            await apiLogout()
            router.push('/login')
        } catch (error) {
            console.error('로그아웃 실패:', error)
            // 서버 로그아웃 실패해도 로컬 로그아웃은 진행
            router.push('/login')
        } finally {
            setLoading(false)
        }
    }

    /**
     * 인증 상태 확인 (디버깅용)
     */
    const checkAuthStatus = () => {
        console.log('🔍 현재 인증 상태:', {
            hasUser: !!user,
            hasToken: !!accessToken,
            isAuthenticated,
            isLoading,
            userInfo: user ? { email: user.email, nickname: user.nickname } : null
        })
    }

    return {
        /** 현재 로그인한 사용자 정보 */
        user,
        /** JWT 액세스 토큰 */
        accessToken,
        /** 인증 상태 (로그인 여부) */
        isAuthenticated,
        /** 로딩 상태 (로그인/로그아웃 진행 중) */
        isLoading,
        /** 로그인 시작 함수 */
        login,
        /** 로그아웃 함수 */
        logout,
        /** 인증 상태 확인 함수 (디버깅용) */
        checkAuthStatus
    }
}
