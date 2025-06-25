'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layouts/page-layout';
import { useRouter } from 'next/navigation';
import KakaoLoginButton from '@/components/login/kakaoLoginButton';
import { ResponsiveWrapper } from '@/components/responsive-wrapper';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleStartButton = () => {
    if (isAuthenticated) {
      // 이미 로그인된 경우 채팅 페이지로 이동
      router.push('/chat');
    } else {
      // 로그인되지 않은 경우 카카오 로그인 시작
      login();
    }
  };

  // 로딩 중인 경우 로딩 화면 표시
  if (isLoading) {
    return (
      <PageLayout variant="gradient" padding="none">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#81C784] border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">로딩 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // 인증된 사용자의 경우 AuthProvider에서 자동 리다이렉트 처리됨
  // 여기서는 로그인하지 않은 사용자만 홈페이지 표시

  const pageContent = (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
      {/* 로고 섹션 */}
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-full">
          <Image
            src="/images/modi-logo.png"
            alt="MODi Logo"
            width={220}
            height={220}
            className="rounded-full"
          />
        </div>
        {/* <h1 className="text-4xl font-bold mt-4">MODi</h1> */}
        <p className="text-m mt-2 text-gray-600 dark:text-gray-300">
          가족과 함께하는
          <br />
          스마트한 요금제 관리
        </p>
      </div>

      {/* 비디오 섹션 */}
      <div className="w-full max-w-md aspect-video">
        <video
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/modi-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 로그인 섹션 */}
      <div className="w-full max-w-sm mt-12">
        <div className="flex justify-center mt-4">
          <KakaoLoginButton />
        </div>
        <p className="text-xs text-center text-gray-500 mt-7">
          카카오 로그인으로 서비스 약관 및 개인정보처리방침에
          <br />
          동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="w-full max-w-md mx-auto">{pageContent}</div>
      </div>
    );
  }

  return <ResponsiveWrapper main={pageContent} />;
}
