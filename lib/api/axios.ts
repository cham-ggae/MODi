import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_ADDR || "http://localhost:8090";

/** 토큰 가져오기 함수 */
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

/** 토큰 업데이트 함수 */
const updateAccessToken = (token: string) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("accessToken", token);
    import("@/store/useAuthStore").then(({ useAuthStore }) => {
      useAuthStore.getState().updateToken(token);
    });
  } catch (error) {
    console.error("토큰 업데이트 실패:", error);
  }
};

/** 인증 초기화 함수 */
const clearAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  import("@/store/useAuthStore").then(({ useAuthStore }) => {
    useAuthStore.getState().clearAuth();
  });
};

/** 토큰 재발급 요청 */
const refreshAccessToken = async (): Promise<string> => {
  const response = await apiClient.post("/refresh", {}, { withCredentials: true });

  const authHeader = response.headers["authorization"] || response.headers["Authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  if (response.data?.accessToken) {
    return response.data.accessToken;
  }

  throw new Error("새 토큰을 찾을 수 없습니다");
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
      console.log("🔑 Authorization 헤더 추가:", accessToken.substring(0, 20) + "...");
    } else {
      console.warn("⚠️ 액세스 토큰 없음:", {
        url: config.url,
        method: config.method,
        windowDefined: typeof window !== "undefined",
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ 요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

/** 응답 인터셉터: 토큰 만료 시 갱신 */
authenticatedApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API 응답 성공:", response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

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

      try {
        const newToken = await refreshAccessToken();
        updateAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authenticatedApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error | AxiosError, null);
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { getAccessToken };
