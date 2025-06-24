import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_ADDR || 'http://localhost:8090';

// 재시도 설정
const REFRESH_RETRY_ATTEMPTS = 3;
const REFRESH_RETRY_DELAY = 1000; // 1초
const NETWORK_TIMEOUT = 15000; // 15초

/** 토큰 가져오기 함수 */
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

/** 토큰 업데이트 함수 */
const updateAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('accessToken', token);
    import('@/store/useAuthStore').then(({ useAuthStore }) => {
      const store = useAuthStore.getState();
      store.updateToken(token);
      store.setRefreshing(false);
    });
  } catch (error) {
    console.error('토큰 업데이트 실패:', error);
  }
};

/** 인증 초기화 함수 */
const clearAuth = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  import('@/store/useAuthStore').then(({ useAuthStore }) => {
    useAuthStore.getState().clearAuth();
  });
};

/** 지연 함수 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 사용자 알림 함수 */
const showLogoutNotification = (reason: string) => {
  if (typeof window === 'undefined') return;

  import('sonner').then(({ toast }) => {
    toast.error('로그인이 만료되었습니다', {
      description: reason,
      duration: 3000,
    });
  });
};

/** 토큰 재발급 요청 (재시도 로직 포함) */
const refreshAccessToken = async (attempt: number = 1): Promise<string> => {
  try {
    console.log(`🔄 토큰 갱신 시도 ${attempt}/${REFRESH_RETRY_ATTEMPTS}`);

    const response = await apiClient.post(
      '/refresh',
      {},
      {
        withCredentials: true,
        timeout: NETWORK_TIMEOUT,
      }
    );

    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.substring(7);
      console.log('✅ 토큰 갱신 성공');
      return newToken;
    }

    if (response.data?.accessToken) {
      console.log('✅ 토큰 갱신 성공 (응답 바디)');
      return response.data.accessToken;
    }

    throw new Error('새 토큰을 찾을 수 없습니다');
  } catch (error) {
    console.error(`❌ 토큰 갱신 실패 (시도 ${attempt}):`, error);

    // 네트워크 오류나 타임아웃의 경우 재시도
    if (attempt < REFRESH_RETRY_ATTEMPTS) {
      const axiosError = error as AxiosError;
      const isNetworkError =
        !axiosError.response ||
        axiosError.code === 'ECONNABORTED' ||
        axiosError.code === 'NETWORK_ERROR';

      if (isNetworkError) {
        console.log(`🔄 네트워크 오류로 인한 재시도 (${REFRESH_RETRY_DELAY}ms 후)`);
        await delay(REFRESH_RETRY_DELAY * attempt); // 지수 백오프
        return refreshAccessToken(attempt + 1);
      }
    }

    // 401/403 오류는 리프레시 토큰 만료로 간주
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }

    throw error;
  }
};

/** 인증 불필요한 API 클라이언트 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

/** 인증 필요한 API 클라이언트 */
export const authenticatedApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error | AxiosError) => void;
}> = [];

const processQueue = (error: Error | AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

/** 요청 인터셉터: JWT 자동 첨부 */
authenticatedApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Authorization 헤더 추가:', accessToken.substring(0, 20) + '...');
      }
    } else {
      console.warn('⚠️ 액세스 토큰 없음:', {
        url: config.url,
        method: config.method,
        windowDefined: typeof window !== 'undefined',
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

/** 응답 인터셉터: 토큰 만료 시 갱신 (개선된 버전) */
authenticatedApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API 응답 성공:', response.config.url, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401, 403 오류이고 재시도하지 않은 경우에만 토큰 갱신 시도
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 이미 갱신 중인 경우 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authenticatedApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      // 스토어에도 갱신 상태 표시
      import('@/store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().setRefreshing(true);
        useAuthStore.getState().updateLastRefreshAttempt();
      });

      try {
        // 토큰 갱신 시도
        const newToken = await refreshAccessToken();
        updateAccessToken(newToken);
        processQueue(null, newToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authenticatedApiClient(originalRequest);
      } catch (refreshError) {
        console.error('🔄 토큰 갱신 최종 실패:', refreshError);

        // 대기열 처리
        processQueue(refreshError as Error | AxiosError, null);

        // 오류 유형에 따른 처리
        const errorMessage = (refreshError as Error).message;
        if (errorMessage === 'REFRESH_TOKEN_EXPIRED') {
          showLogoutNotification('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          showLogoutNotification('네트워크 오류로 인해 로그아웃됩니다. 다시 시도해주세요.');
        }

        // 인증 정보 초기화 및 리다이렉트
        clearAuth();

        // 페이지 리다이렉트 지연 (사용자가 알림을 볼 수 있도록)
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }, 1500);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;

        // 스토어 갱신 상태도 정리
        import('@/store/useAuthStore').then(({ useAuthStore }) => {
          useAuthStore.getState().setRefreshing(false);
        });
      }
    }

    return Promise.reject(error);
  }
);

export { getAccessToken };
