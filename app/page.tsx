'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Smartphone, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layouts/page-layout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KakaoLoginButton from '@/components/login/kakaoLoginButton';
import { ResponsiveWrapper } from '@/components/responsive-wrapper';
import { useIsMobile } from '@/hooks/use-mobile';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  // 로그인된 사용자가 루트 페이지에 접근하면 자동으로 /chat으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/chat');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleStartButton = () => {
    if (isAuthenticated) {
      // 이미 로그인된 경우 채팅 페이지로 이동
      router.push('/chat');
    } else {
      // 로그인되지 않은 경우 카카오 로그인 시작
      login();
    }
  };

  // 로딩 중이거나 인증된 사용자인 경우 로딩 화면 표시
  if (isLoading || isAuthenticated) {
    return (
      <PageLayout variant="gradient" padding="none">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#81C784] border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">페이지로 이동하는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const pageContent = (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-12">
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-full shadow-lg">
          <span className="text-4xl font-bold text-green-500">M</span>
        </div>
        <h1 className="text-4xl font-bold mt-4">MODi</h1>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          가족과 함께하는
          <br />
          스마트한 요금제 관리
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">요금제 분석</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">맞춤형 추천</p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">가족 결합</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">할인 혜택</p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI 상담</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">24시간 지원</p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">비용 절약</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">최적화</p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <KakaoLoginButton />
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">
          카카오 로그인으로 서비스 약관 및 개인정보처리방침에
          <br />
          동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="w-full max-w-md mx-auto">{pageContent}</div>
      </div>
    );
  }

  return <ResponsiveWrapper main={pageContent} />;
}
