import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthRedirectOptions {
  /** 로그인된 사용자를 리다이렉트할 경로 */
  authenticatedRedirectTo?: string;
  /** 로그인되지 않은 사용자를 리다이렉트할 경로 */
  unauthenticatedRedirectTo?: string;
  /** 특정 경로에서만 리다이렉트 실행 */
  onlyFromPath?: string;
  /** 리다이렉트 시 히스토리 교체 여부 */
  replace?: boolean;
  /** 디버그 로그 활성화 */
  enableDebug?: boolean;
}

/**
 * 인증 상태 기반 자동 리다이렉트 훅
 *
 * @example
 * // 로그인된 사용자를 루트 페이지에서 /chat으로 리다이렉트
 * useAuthRedirect({
 *   authenticatedRedirectTo: '/chat',
 *   onlyFromPath: '/',
 *   replace: true
 * });
 *
 * @example
 * // 로그인되지 않은 사용자를 보호된 페이지에서 로그인 페이지로 리다이렉트
 * useAuthRedirect({
 *   unauthenticatedRedirectTo: '/login',
 *   replace: true
 * });
 */
export const useAuthRedirect = (options: AuthRedirectOptions = {}) => {
  const {
    authenticatedRedirectTo,
    unauthenticatedRedirectTo,
    onlyFromPath,
    replace = false,
    enableDebug = process.env.NODE_ENV === 'development',
  } = options;

  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 로딩 중이거나 초기화되지 않은 경우 대기
    if (isLoading) {
      return;
    }

    // 특정 경로에서만 실행하도록 제한
    if (onlyFromPath && pathname !== onlyFromPath) {
      return;
    }

    // 로그인된 사용자 리다이렉트
    if (isAuthenticated && authenticatedRedirectTo) {
      if (enableDebug) {
        console.log(`🔄 인증된 사용자 리다이렉트: ${pathname} → ${authenticatedRedirectTo}`);
      }

      if (replace) {
        router.replace(authenticatedRedirectTo);
      } else {
        router.push(authenticatedRedirectTo);
      }
      return;
    }

    // 로그인되지 않은 사용자 리다이렉트
    if (!isAuthenticated && unauthenticatedRedirectTo) {
      if (enableDebug) {
        console.log(`🔄 미인증 사용자 리다이렉트: ${pathname} → ${unauthenticatedRedirectTo}`);
      }

      if (replace) {
        router.replace(unauthenticatedRedirectTo);
      } else {
        router.push(unauthenticatedRedirectTo);
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    authenticatedRedirectTo,
    unauthenticatedRedirectTo,
    onlyFromPath,
    replace,
    enableDebug,
    router,
  ]);

  return {
    isAuthenticated,
    isLoading,
    pathname,
  };
};

/**
 * 루트 페이지에서 로그인된 사용자를 /chat으로 리다이렉트하는 편의 훅
 */
export const useRootRedirect = () => {
  return useAuthRedirect({
    authenticatedRedirectTo: '/chat',
    onlyFromPath: '/',
    replace: true,
  });
};

/**
 * 보호된 페이지에서 로그인되지 않은 사용자를 루트로 리다이렉트하는 편의 훅
 */
export const useProtectedPageRedirect = () => {
  return useAuthRedirect({
    unauthenticatedRedirectTo: '/',
    replace: true,
  });
};
