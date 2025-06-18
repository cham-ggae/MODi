"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

// QueryClient 기본 설정
const createQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // 기본 staleTime: 5분
                staleTime: 5 * 60 * 1000,
                // 기본 gcTime: 10분 (구 cacheTime)
                gcTime: 10 * 60 * 1000,
                // 기본 재시도 횟수: 3회
                retry: 3,
                // 재시도 딜레이: 지수 백오프
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // 윈도우 포커스시 리페치 비활성화 (선택사항)
                refetchOnWindowFocus: false,
                // 네트워크 재연결시 리페치
                refetchOnReconnect: true,
            },
            mutations: {
                // 뮤테이션 기본 재시도 횟수: 1회
                retry: 1,
                // 뮤테이션 재시도 딜레이
                retryDelay: 1000,
            },
        },
    })
}

interface QueryProviderProps {
    children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
    // useState를 사용하여 QueryClient 인스턴스가 한 번만 생성되도록 함
    const [queryClient] = useState(() => createQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* 개발 환경에서만 DevTools 활성화 */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                />
            )}
        </QueryClientProvider>
    )
}
