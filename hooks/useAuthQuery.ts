import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { testProtectedApi, logout } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'

/**
 * 인증 상태 확인을 위한 React Query 훅
 * - 서버와 클라이언트 인증 상태 동기화
 * - 토큰 유효성 실시간 검증
 * - 자동 토큰 갱신 테스트
 *
 * @returns 인증 상태 쿼리 결과
 */
export const useAuthStatusQuery = () => {
    const { isAuthenticated } = useAuthStore()

    return useQuery({
        queryKey: ['auth', 'status'],
        queryFn: () => testProtectedApi(),
        enabled: isAuthenticated, // 인증된 상태에서만 실행
        retry: false, // 실패 시 재시도 안함 (로그아웃 처리)
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    })
}

/**
 * 로그아웃을 위한 React Query Mutation 훅
 * - 서버 로그아웃 API 호출
 * - 모든 쿼리 캐시 초기화
 * - 로컬 인증 상태 초기화
 * - 실패해도 로컬 상태는 초기화
 *
 * @returns 로그아웃 뮤테이션 객체
 */
export const useLogoutMutation = () => {
    const queryClient = useQueryClient()
    const { clearAuth } = useAuthStore()

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // 모든 React Query 캐시 초기화
            queryClient.clear()
            clearAuth()
        },
        onError: (error) => {
            console.error('로그아웃 실패:', error)
            // 서버 로그아웃 실패해도 로컬 상태는 초기화
            clearAuth()
        }
    })
}
