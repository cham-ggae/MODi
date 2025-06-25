/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // 개발 환경에서는 localhost를 사용하고, 프로덕션에서는 배포된 백엔드를 사용
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://modi-backend-th1n.onrender.com'
        : 'http://localhost:8090',
  },
  // 환경 변수 정의
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://modi-backend-th1n.onrender.com'
        : 'http://localhost:8090',
  },
  // CORS 문제 해결을 위한 리라이트 설정
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/backend/:path*',
            destination: 'https://modi-backend-th1n.onrender.com/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
