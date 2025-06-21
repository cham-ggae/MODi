'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Users, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useFamily } from '@/hooks/family';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function FamilySpaceTutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinError, setJoinError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { createFamily, hasFamily, joinFamily } = useFamily();
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

  const handleJoinFamily = async () => {
    if (!inviteCode.trim()) {
      setJoinError('초대 코드를 입력해주세요.');
      return;
    }

    if (inviteCode.trim().length !== 6) {
      setJoinError('6자리 초대 코드를 모두 입력해주세요.');
      return;
    }

    setIsJoining(true);
    setJoinError(''); // 에러 초기화

    try {
      await joinFamily({
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      toast({
        title: '가족에 성공적으로 참여했습니다! 🎉',
        description: '이제 가족들과 함께 식물을 키워보세요.',
      });

      setIsJoinModalOpen(false);
      setInviteCode('');
      router.push('/family-space');
    } catch (error: any) {
      console.error('가족 참여 실패:', error);

      // 400 에러 처리
      if (error.response?.status === 400) {
        setJoinError('잘못된 초대 코드입니다. 다시 확인해주세요.');
      } else {
        setJoinError('가족 참여 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast({
        title: '초대 코드가 복사되었습니다!',
        description: '가족들에게 공유해보세요.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: '복사에 실패했습니다',
        variant: 'destructive',
      });
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
    <>
      <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-center p-4 flex-shrink-0 relative">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              {currentStep + 1} / {tutorialSteps.length}
            </div>
          </div>
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

              {/* 가입하기 버튼 - 첫 번째와 마지막 페이지에만 표시 */}
              {(currentStep === 0 || currentStep === tutorialSteps.length - 1) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-6 flex justify-center"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setJoinError(''); // 모달 열 때 에러 초기화
                      setInviteCode(''); // 입력값도 초기화
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    이미 가족이 있으신가요? 가입하기
                  </Button>
                </motion.div>
              )}
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

      {/* 가입하기 모달 */}
      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Users className="w-5 h-5 mr-2" />
              가족 스페이스 참여하기
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">💡 초대 코드가 필요해요</h4>
              <p className="text-sm text-green-700">
                가족 구성원에게 받은 6자리 초대 코드를 입력해주세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-code" className="text-sm font-medium">
                초대 코드
              </Label>
              <div className="flex gap-2">
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    setInviteCode(newValue);
                    // 6자리 모두 입력되면 에러 메시지 초기화
                    if (newValue.length === 6) {
                      setJoinError('');
                    }
                  }}
                  placeholder="예: ABC123"
                  className={`flex-1 font-mono text-center text-lg tracking-wider ${
                    joinError ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={6}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  disabled={!inviteCode}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* 에러 메시지 */}
              {joinError && inviteCode.trim().length === 6 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                >
                  <span className="text-red-500">⚠️</span>
                  {joinError}
                </motion.div>
              )}

              {/* 입력 안내 메시지 */}
              {inviteCode.trim().length > 0 && inviteCode.trim().length < 6 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-500 text-sm mt-2 flex items-center gap-2"
                >
                  <span>📝</span>
                  {6 - inviteCode.trim().length}자리 더 입력해주세요
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsJoinModalOpen(false);
                  setInviteCode('');
                  setJoinError(''); // 모달 닫을 때도 에러 초기화
                }}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleJoinFamily}
                disabled={isJoining || inviteCode.trim().length !== 6}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? '참여 중...' : '가족 참여하기'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
