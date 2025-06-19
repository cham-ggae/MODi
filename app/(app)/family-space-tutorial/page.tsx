'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useFamily } from '@/hooks/family';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function FamilySpaceTutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { createFamily, hasFamily } = useFamily();
  const { user } = useAuth();

  // 이미 가족이 있는 경우 family-space로 리다이렉트
  useEffect(() => {
    if (hasFamily) {
      router.push('/family-space');
    }
  }, [hasFamily, router]);

  const tutorialSteps = [
    {
      id: 1,
      title: '함께하는 보람,\n메시지로 남겨요',
      image: '/images/tutorial1.png',
      description: '가족과 소중한 메시지를 주고받으며 추억을 만들어요',
    },
    {
      id: 2,
      title: '요금제 추천도\n가족이 함께',
      image: '/images/tutorial2.png',
      description: '가족 구성원의 성향을 파악해 최적의 요금제를 추천받아요',
    },
    {
      id: 3,
      title: '새싹이 피어나는\n우리 가족 공간',
      image: '/images/tutorial3.png',
      description: '가족과 함께 키우는 식물로 더욱 특별하게',
    },
    {
      id: 4,
      title: '가족 초대는\n언제든 쉽게!',
      image: '/images/tutorial4.png',
      description: '가족을 초대하고 함께 요금제를 관리해보세요',
    },
  ];

  const handleCreateFamily = async () => {
    if (!user?.nickname) {
      toast({
        title: '사용자 정보를 불러올 수 없습니다',
        description: '로그인 상태를 확인해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);

    try {
      // 사용자 닉네임을 가족명으로 사용
      const familyName = user.nickname;

      await createFamily({
        name: familyName,
        combiType: '투게더 결합',
      });

      // 성공 후 family-space 페이지로 이동
      router.push('/family-space');
    } catch (error) {
      console.error('가족 스페이스 생성 실패:', error);
      // 에러 토스트는 useCreateFamily 뮤테이션에서 처리됨
    } finally {
      setIsCreating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 튜토리얼 완료 후 가족 스페이스 생성
      handleCreateFamily();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-50 to-blue-50 max-w-md mx-auto flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <div className="w-8 h-8" /> {/* Spacer */}
        <div className="text-sm font-medium text-gray-600">
          {currentStep + 1} / {tutorialSteps.length}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/family-space')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          건너뛰기
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-center"
          >
            {/* Image */}
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image
                    src={currentTutorial.image || '/placeholder.svg'}
                    alt={currentTutorial.title}
                    width={192}
                    height={192}
                    className="object-contain drop-shadow-lg"
                  />
                </motion.div>
              </div>
            </div>

            {/* Title */}
            <motion.h1
              className="text-xl font-bold text-gray-900 mb-3 leading-tight whitespace-pre-line"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {currentTutorial.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-gray-600 text-sm leading-relaxed px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {currentTutorial.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center mb-6 flex-shrink-0">
        <div className="flex space-x-3">
          {tutorialSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-green-500 w-8'
                  : index < currentStep
                  ? 'bg-green-300 w-2'
                  : 'bg-gray-300 w-2'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">이전</span>
          </Button>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={isCreating}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <span>
              {currentStep === tutorialSteps.length - 1
                ? isCreating
                  ? '생성 중...'
                  : `${user?.nickname || '내'} 가족 스페이스 생성`
                : '다음'}
            </span>
            {currentStep === tutorialSteps.length - 1 ? (
              isCreating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                >
                  ⏳
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                >
                  ✨
                </motion.div>
              )
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
