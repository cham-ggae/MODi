'use client'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export default function KakaoLoginButton() {
    const {
        user,           // 사용자 정보
        isAuthenticated, // 로그인 상태
        isLoading,      // 로딩 상태
        login,          // 로그인 함수
        logout          // 로그아웃 함수
    } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                <span className="ml-2 text-gray-600">로딩 중...</span>
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <div className="flex items-center space-x-4">

                <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 font-medium"
                >
                    로그아웃
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={login}
            className="inline-block hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-md"
            aria-label="카카오 로그인"
        >
            {/* 카카오 공식 로그인 버튼 이미지 */}
            <Image
                src="/images/kakao_login_medium_narrow.png"
                alt="카카오 로그인"
                width={183}
                height={45}
                className="rounded-md"
                priority
            />
        </button>
    )
}
