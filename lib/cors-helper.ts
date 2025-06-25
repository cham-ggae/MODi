// CORS 문제 해결을 위한 환경 전환 헬퍼

export const BACKEND_URLS = {
  local: 'http://localhost:8090',
  deployed: 'https://modi-backend-th1n.onrender.com',
  proxy: '/api/backend', // Next.js 프록시 사용
} as const;

/**
 * 개발 환경에서 CORS 문제를 우회하는 방법들:
 *
 * 1. 프록시 사용 (권장):
 *    - URL: /api/backend/kakao
 *    - Next.js가 자동으로 배포된 백엔드로 프록시
 *
 * 2. 로컬 백엔드 사용:
 *    - 로컬에서 백엔드 서버 실행
 *    - URL: http://localhost:8090/kakao
 *
 * 3. 환경 변수 강제 설정:
 *    - NEXT_PUBLIC_USE_PROXY=true
 */

export const getBackendUrl = () => {
  // 프록시 사용 강제 설정
  if (process.env.NEXT_PUBLIC_USE_PROXY === 'true') {
    return BACKEND_URLS.proxy;
  }

  // 로컬 백엔드 강제 사용
  if (process.env.NEXT_PUBLIC_USE_LOCAL === 'true') {
    return BACKEND_URLS.local;
  }

  // 배포된 백엔드 강제 사용
  if (process.env.NEXT_PUBLIC_USE_DEPLOYED === 'true') {
    return BACKEND_URLS.deployed;
  }

  // 기본 설정
  if (process.env.NODE_ENV === 'production') {
    return BACKEND_URLS.deployed;
  }

  // 개발 환경에서는 프록시 우선 사용
  return BACKEND_URLS.proxy;
};

// 디버그 정보
export const debugBackendConfig = () => {
  if (typeof window !== 'undefined') {
    console.log('🌐 Backend Configuration:');
    console.log('  Available URLs:', BACKEND_URLS);
    console.log('  Current URL:', getBackendUrl());
    console.log('  Environment Variables:');
    console.log('    NODE_ENV:', process.env.NODE_ENV);
    console.log('    NEXT_PUBLIC_USE_PROXY:', process.env.NEXT_PUBLIC_USE_PROXY);
    console.log('    NEXT_PUBLIC_USE_LOCAL:', process.env.NEXT_PUBLIC_USE_LOCAL);
    console.log('    NEXT_PUBLIC_USE_DEPLOYED:', process.env.NEXT_PUBLIC_USE_DEPLOYED);
  }
};
