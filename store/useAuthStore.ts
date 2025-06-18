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

  // 액션들
  setAuth: (token: string, user: User) => void; // auth.ts와 호환
  setUser: (user: User & { accessToken: string }) => void; // 기존 호환성
  clearAuth: () => void;
  clearUser: () => void; // 기존 호환성
  initAuth: () => void;
  updateToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setRequiresAdditionalInfo: (requires: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  requiresAdditionalInfo: false,

  // auth.ts에서 사용하는 새로운 방식
  setAuth: (token: string, user: User) => {
    localStorage.setItem('accessToken', token);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
      requiresAdditionalInfo: false,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ 인증 설정 완료:', user.email);
    }
  },

  // 기존 방식 (호환성 유지)
  setUser: (user: User & { accessToken: string }) => {
    localStorage.setItem('accessToken', user.accessToken);
    set({
      user: { email: user.email, nickname: user.nickname },
      accessToken: user.accessToken,
      isAuthenticated: true,
      isLoading: false,
      requiresAdditionalInfo: false,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ 사용자 설정 완료:', user.email);
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

      if (process.env.NODE_ENV === 'development') {
        console.log('인증 상태 확인:', {
          hasToken: !!token,
          hasUser: !!user,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        });
      }

      set({
        accessToken: token,
        isAuthenticated: !!(token && user),
        isLoading: false,
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
      });
    }
  },

  updateToken: (token: string) => {
    localStorage.setItem('accessToken', token);
    const { user } = get();

    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 토큰 업데이트:', token.substring(0, 20) + '...');
    }

    if (user) {
      set({
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        accessToken: token,
        isAuthenticated: !!token,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRequiresAdditionalInfo: (requires: boolean) => {
    set({ requiresAdditionalInfo: requires });
  },
}));
