'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore'; // 통합된 스토어 사용
import { useRouter, usePathname } from 'next/navigation';
import { refreshAccessToken } from '@/lib/api/auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 인증 상태 초기화 및 관리 프로바이더
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    isLoading,
    isAuthenticated,
    accessToken,
    user,
    initAuth,
    shouldRefreshToken,
    setRefreshing,
    updateLastRefreshAttempt,
    updateToken,
    clearAuth,
    isRefreshing,
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // 디버깅용 상태 로그
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 AuthProvider 상태 변경:', {
        isInitialized,
        isLoading,
        isAuthenticated,
        hasToken: !!accessToken,
        hasUser: !!user,
        pathname,
        tokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : 'none',
      });
    }
  }, [isInitialized, isLoading, isAuthenticated, accessToken, user, pathname]);

  // 사전 토큰 갱신 함수
  const preemptiveTokenRefresh = async () => {
    if (!shouldRefreshToken() || isRefreshing) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 사전 토큰 갱신 시작');
    }

    try {
      setRefreshing(true);
      updateLastRefreshAttempt();

      const newToken = await refreshAccessToken();
      updateToken(newToken);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ 사전 토큰 갱신 성공');
      }
    } catch (error) {
      console.error('❌ 사전 토큰 갱신 실패:', error);

      // 리프레시 토큰이 만료된 경우에만 로그아웃
      if ((error as Error).message === 'REFRESH_TOKEN_EXPIRED') {
        clearAuth();
        router.push('/');
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 AuthProvider 초기화 시작');
      }

      try {
        // 1. 약간의 지연으로 초기화 보장
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 2. 인증 상태 초기화
        initAuth();

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ AuthProvider 초기화 완료');
        }
      } catch (error) {
        console.error('❌ AuthProvider 초기화 실패:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [initAuth]);

  // 인증된 사용자의 루트 페이지 접근 시 리다이렉트
  useEffect(() => {
    // 모든 조건이 충족되었는지 확인
    if (!isInitialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏳ 초기화 대기 중...');
      }
      return;
    }

    if (isLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏳ 로딩 중...');
      }
      return;
    }

    if (pathname !== '/') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 루트 페이지가 아님:', pathname);
      }
      return;
    }

    // 토큰이 있는 경우 인증된 것으로 간주 (사용자 정보가 없어도)
    const hasValidToken = !!accessToken;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 리다이렉트 조건 체크:', {
        isInitialized,
        isLoading,
        isAuthenticated,
        hasValidToken,
        hasUser: !!user,
        pathname,
        shouldRedirect: hasValidToken,
      });
    }

    if (hasValidToken) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 인증된 사용자 자동 리다이렉트: / → /chat');
      }
      router.replace('/chat');
    }
  }, [isInitialized, isLoading, isAuthenticated, accessToken, user, pathname, router]);

  // 주기적인 토큰 갱신 체크
  useEffect(() => {
    if (!isAuthenticated || !isInitialized) {
      return;
    }

    // 즉시 한 번 체크
    preemptiveTokenRefresh();

    // 1분마다 토큰 만료 시간 체크
    const tokenCheckInterval = setInterval(() => {
      preemptiveTokenRefresh();
    }, 60 * 1000);

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [isAuthenticated, isInitialized, shouldRefreshToken, isRefreshing]);

  // 초기화 완료 전에는 로딩 표시
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#81C784] border-t-transparent animate-spin rounded-full"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {!isInitialized ? '인증 시스템 초기화 중...' : '인증 정보를 확인하는 중...'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 text-center">
              <p>
                디버그: isInitialized={isInitialized.toString()}, isLoading={isLoading.toString()}
              </p>
              <p>
                hasToken={!!accessToken ? 'true' : 'false'}, isAuthenticated=
                {isAuthenticated.toString()}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 인증이 필요한 페이지를 보호하는 HOC
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/'
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        if (process.env.NODE_ENV === 'development') {
          console.log('인증되지 않은 사용자 - 루트 페이지로 리다이렉트');
        }
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, router, redirectTo]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#81C784] border-t-transparent animate-spin rounded-full"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
