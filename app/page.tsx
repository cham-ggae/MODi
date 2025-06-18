'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Smartphone, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layouts/page-layout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

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

  return (
    <PageLayout variant="gradient" padding="none">
      {/* Header */}
      <div className="text-center pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">MODI</h1>
        </motion.div>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          가족과 함께하는
          <br />
          <span className="text-green-600 dark:text-green-400 font-semibold">
            스마트한 요금제 관리
          </span>
        </motion.p>

        {/* 로그인 상태 표시 (디버깅용) */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-800 rounded-lg mx-8"
          >
            <p className="text-sm text-green-700 dark:text-green-200">
              안녕하세요, {user.nickname}님! 👋
            </p>
          </motion.div>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          <div className="grid grid-cols-2 gap-4">
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
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleStartButton}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-2xl text-lg mb-4 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
                로딩 중...
              </div>
            ) : (
              '카카오로 시작하기'
            )}
          </Button>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            카카오 로그인으로 서비스 약관 및 개인정보처리방침에
            <br />
            동의하는 것으로 간주됩니다
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
