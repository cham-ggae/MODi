import { create } from 'zustand';

interface User {
  email: string;
  nickname: string;
  accessToken?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresAdditionalInfo: boolean;
  // 새로운 상태들
  isRefreshing: boolean;
  lastRefreshAttempt: number | null;
  tokenExpiresAt: number | null;

  // 액션들
  setAuth: (token: string, user: User) => void; // auth.ts와 호환
  setUser: (user: User & { accessToken: string }) => void; // 기존 호환성
  clearAuth: () => void;
  clearUser: () => void; // 기존 호환성
  initAuth: () => void;
  updateToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setRequiresAdditionalInfo: (requires: boolean) => void;
  // 새로운 액션들
  setRefreshing: (refreshing: boolean) => void;
  setTokenExpiresAt: (expiresAt: number | null) => void;
  updateLastRefreshAttempt: () => void;
  shouldRefreshToken: () => boolean;
}

// JWT 토큰에서 만료 시간 추출
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.exp ? decoded.exp * 1000 : null; // exp는 초 단위이므로 밀리초로 변환
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  requiresAdditionalInfo: false,
  isRefreshing: false,
  lastRefreshAttempt: null,
  tokenExpiresAt: null,

  // auth.ts에서 사용하는 새로운 방식
  setAuth: (token: string, user: User) => {
    const expiresAt = getTokenExpirationTime(token);
    localStorage.setItem('accessToken', token);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
      requiresAdditionalInfo: false,
      tokenExpiresAt: expiresAt,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '✅ 인증 설정 완료:',
        user.email,
        '만료:',
        expiresAt ? new Date(expiresAt) : 'N/A'
      );
    }
  },

  // 기존 방식 (호환성 유지)
  setUser: (user: User & { accessToken: string }) => {
    const expiresAt = getTokenExpirationTime(user.accessToken);
    localStorage.setItem('accessToken', user.accessToken);
    set({
      user: { email: user.email, nickname: user.nickname },
      accessToken: user.accessToken,
      isAuthenticated: true,
      isLoading: false,
      requiresAdditionalInfo: false,
      tokenExpiresAt: expiresAt,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '✅ 사용자 설정 완료:',
        user.email,
        '만료:',
        expiresAt ? new Date(expiresAt) : 'N/A'
      );
    }
  },

  clearAuth: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 인증 정보 완전 삭제');
    }
    localStorage.removeItem('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      requiresAdditionalInfo: false,
      isRefreshing: false,
      lastRefreshAttempt: null,
      tokenExpiresAt: null,
    });
  },

  // 기존 방식 (호환성 유지)
  clearUser: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 사용자 정보 삭제');
    }
    localStorage.removeItem('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      requiresAdditionalInfo: false,
      isRefreshing: false,
      lastRefreshAttempt: null,
      tokenExpiresAt: null,
    });
  },

  initAuth: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 인증 초기화 시작');
    }

    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const { user } = get();
      const expiresAt = token ? getTokenExpirationTime(token) : null;

      if (process.env.NODE_ENV === 'development') {
        console.log('인증 상태 확인:', {
          hasToken: !!token,
          hasUser: !!user,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
          expiresAt: expiresAt ? new Date(expiresAt) : 'N/A',
        });
      }

      set({
        accessToken: token,
        isAuthenticated: !!(token && user),
        isLoading: false,
        tokenExpiresAt: expiresAt,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ 인증 초기화 완료');
      }
    } catch (error) {
      console.error('❌ 인증 초기화 실패:', error);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        requiresAdditionalInfo: false,
        isRefreshing: false,
        lastRefreshAttempt: null,
        tokenExpiresAt: null,
      });
    }
  },

  updateToken: (token: string) => {
    const expiresAt = getTokenExpirationTime(token);
    localStorage.setItem('accessToken', token);
    const { user } = get();

    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🔄 토큰 업데이트:',
        token.substring(0, 20) + '...',
        '만료:',
        expiresAt ? new Date(expiresAt) : 'N/A'
      );
    }

    if (user) {
      set({
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
        tokenExpiresAt: expiresAt,
      });
    } else {
      set({
        accessToken: token,
        isAuthenticated: !!token,
        isLoading: false,
        tokenExpiresAt: expiresAt,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRequiresAdditionalInfo: (requires: boolean) => {
    set({ requiresAdditionalInfo: requires });
  },

  // 새로운 액션들
  setRefreshing: (refreshing: boolean) => {
    set({ isRefreshing: refreshing });
  },

  setTokenExpiresAt: (expiresAt: number | null) => {
    set({ tokenExpiresAt: expiresAt });
  },

  updateLastRefreshAttempt: () => {
    set({ lastRefreshAttempt: Date.now() });
  },

  shouldRefreshToken: () => {
    const { tokenExpiresAt, lastRefreshAttempt } = get();

    if (!tokenExpiresAt) return false;

    const now = Date.now();
    const timeUntilExpiry = tokenExpiresAt - now;
    const refreshThreshold = 5 * 60 * 1000; // 5분 전에 갱신

    // 최근에 갱신을 시도했다면 1분 후에 다시 시도
    if (lastRefreshAttempt && now - lastRefreshAttempt < 60 * 1000) {
      return false;
    }

    return timeUntilExpiry <= refreshThreshold;
  },
}));
