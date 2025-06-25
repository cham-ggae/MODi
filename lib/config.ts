import { getBackendUrl } from './cors-helper';

// 환경 설정 관리
export const config = {
  // API 설정
  api: {
    // 개발 환경
    development: {
      baseUrl: 'http://localhost:8090',
      timeout: 30000, // 30초로 증가
    },
    // 프로덕션 환경 (배포된 백엔드)
    production: {
      baseUrl: 'https://modi-backend-th1n.onrender.com',
      timeout: 60000, // 60초로 증가 (배포 서버는 더 오래 걸릴 수 있음)
    },
  },

  // 현재 환경에 따른 API 설정 가져오기
  getCurrentApiConfig() {
    const env = process.env.NODE_ENV || 'development';
    return this.api[env as keyof typeof this.api] || this.api.development;
  },

  // API URL 가져오기
  getApiUrl() {
    // 환경변수로 직접 설정된 경우 우선 사용
    if (process.env.NEXT_PUBLIC_ADDR) {
      return process.env.NEXT_PUBLIC_ADDR;
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // CORS 헬퍼 사용
    return getBackendUrl();
  },

  // 개발 모드 여부 확인
  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },

  // 프로덕션 모드 여부 확인
  isProduction() {
    return process.env.NODE_ENV === 'production';
  },

  // 환경 정보 출력 (디버깅용)
  debugEnvironment() {
    if (typeof window !== 'undefined') {
      console.log('🌍 Environment Debug Info:');
      console.log('  NODE_ENV:', process.env.NODE_ENV);
      console.log('  NEXT_PUBLIC_ADDR:', process.env.NEXT_PUBLIC_ADDR);
      console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('  Current API URL:', this.getApiUrl());
      console.log('  Is Development:', this.isDevelopment());
      console.log('  Is Production:', this.isProduction());
    }
  },
};
