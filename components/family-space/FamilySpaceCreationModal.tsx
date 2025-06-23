'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Users, CheckCircle, Sparkles, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFamilySpace } from '@/contexts/family-space-context';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface FamilySpaceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FamilySpaceCreationModal({ isOpen, onClose }: FamilySpaceCreationModalProps) {
  const [step, setStep] = useState<'create' | 'creating' | 'success'>('create');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { createFamilySpace } = useFamilySpace();

  // 카카오톡 SDK 초기화
  useEffect(() => {
    const loadKakaoSDK = () => {
      return new Promise<void>((resolve, reject) => {
        // 이미 로드되어 있는 경우
        if (window.Kakao) {
          resolve();
          return;
        }

        // 스크립트가 로드 중인지 확인
        const existingScript = document.querySelector('script[src*="kakao.js"]');
        if (existingScript) {
          // 스크립트가 로드될 때까지 대기
          const checkLoaded = setInterval(() => {
            if (window.Kakao) {
              clearInterval(checkLoaded);
              resolve();
            }
          }, 100);

          // 10초 후 타임아웃
          setTimeout(() => {
            clearInterval(checkLoaded);
            reject(new Error('카카오 SDK 로드 타임아웃'));
          }, 10000);
          return;
        }

        // 스크립트 동적 로드
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ FamilySpaceCreationModal - 카카오 SDK 스크립트 로드 완료');
          resolve();
        };
        script.onerror = () => {
          console.error('❌ FamilySpaceCreationModal - 카카오 SDK 스크립트 로드 실패');
          reject(new Error('카카오 SDK 스크립트 로드 실패'));
        };
        document.head.appendChild(script);
      });
    };

    const initKakao = async () => {
      try {
        console.log('🔍 FamilySpaceCreationModal - 카카오 SDK 초기화 시도:', {
          windowExists: typeof window !== 'undefined',
          windowKakao: typeof window !== 'undefined' ? !!window.Kakao : false,
          isInitialized: typeof window !== 'undefined' && window.Kakao ? window.Kakao.isInitialized() : false,
          jsKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY
        });

        // SDK 로드 대기
        await loadKakaoSDK();

        if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
          console.log('✅ FamilySpaceCreationModal - 카카오 SDK 초기화 실행');
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          console.log('✅ FamilySpaceCreationModal - 카카오 SDK 초기화 완료');
        }
      } catch (error) {
        console.error('❌ FamilySpaceCreationModal - 카카오 SDK 초기화 실패:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initKakao();
    }
  }, []);

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      toast({
        title: '가족 이름을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    // 생성 중 단계로 전환
    setStep('creating');

    // 2초 후 성공 단계로 전환
    setTimeout(() => {
      const code = generateInviteCode();
      setInviteCode(code);

      // 기본 가족 구성원으로 생성
      const defaultMembers = [
        { id: '1', name: '아빠', plan: '5G 시그니처', usage: '45GB', avatar: '👨' },
        { id: '2', name: '엄마', plan: '5G 스탠다드', usage: '23GB', avatar: '👩' },
        { id: '3', name: '나', plan: '5G 프리미엄', usage: '67GB', avatar: '🧑' },
      ];

      // FamilySpaceContext를 통해 가족 스페이스 생성
      createFamilySpace(defaultMembers);

      // 초대 코드 저장
      localStorage.setItem('familyInviteCode', code);
      localStorage.setItem('familyName', familyName);

      setStep('success');
    }, 2000);
  };

  const handleCopyCode = async () => {
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

  const handleShareKakao = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const imageUrl = `${baseUrl}/images/modi-logo-small.png`;

    console.log('🔍 FamilySpaceCreationModal - 카카오 공유 시도:', {
      windowKakao: !!window.Kakao,
      isInitialized: window.Kakao?.isInitialized?.(),
      familyName,
      inviteCode,
      imageUrl
    });

    // 카카오톡 공유만 사용하고 브라우저 공유 기능은 제거
    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log('✅ FamilySpaceCreationModal - 카카오 SDK 초기화됨, 공유 실행');
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: `🌱 ${familyName} 가족 스페이스에 초대합니다!`,
          description: `함께 식물을 키우고 요금제도 절약해요!\n초대 코드: ${inviteCode}`,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: 'https://modi.app',
            webUrl: 'https://modi.app',
          },
        },
        buttons: [
          {
            title: 'MODi에서 확인',
            link: {
              mobileWebUrl: 'https://modi.app',
              webUrl: 'https://modi.app',
            },
          },
        ],
      });
    } else {
      console.log('❌ FamilySpaceCreationModal - 카카오 SDK 초기화 안됨, 클립보드 복사로 대체');
      // 카카오톡 SDK가 없는 경우 클립보드에 복사
      const shareText = `🌱 ${familyName} 가족 스페이스에 초대합니다!\n\n초대 코드: ${inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi 앱 다운로드: https://modi.app`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: '공유 메시지가 복사되었습니다!',
        description: '카카오톡에서 붙여넣기 해주세요.',
      });
    }
  };

  const handleConfirm = () => {
    // 모달 닫기
    handleClose();
    // 가족 스페이스 페이지로 이동
    router.push('/family-space');
  };

  const handleClose = () => {
    setStep('create');
    setFamilyName('');
    setInviteCode('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center text-[#388E3C]">
                  <Users className="w-5 h-5 mr-2" />
                  가족 스페이스 만들기
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="family-name" className="text-sm font-medium">
                    가족 이름
                  </Label>
                  <Input
                    id="family-name"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="예: 김씨네 가족"
                    className="mt-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFamily();
                      }
                    }}
                  />
                </div>
                <div className="bg-[#F1F8E9] p-4 rounded-lg">
                  <h4 className="font-medium text-[#388E3C] mb-2">
                    가족 스페이스에서 할 수 있는 것들
                  </h4>
                  <ul className="text-sm text-[#4E342E] space-y-1">
                    <li>• 함께 식물 키우기 🌱</li>
                    <li>• 가족 메시지 카드 주고받기 💌</li>
                    <li>• 요금제 정보 공유하기 📱</li>
                    <li>• 가족 결합 할인 받기 💰</li>
                  </ul>
                </div>
                <Button
                  onClick={handleCreateFamily}
                  className="w-full bg-[#81C784] hover:bg-[#388E3C]"
                >
                  가족 스페이스 만들기
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'creating' && (
            <motion.div
              key="creating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                className="w-16 h-16 bg-[#81C784] rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#388E3C] mb-2">가족 스페이스 생성 중...</h3>
              <p className="text-[#4E342E] opacity-70">초대 코드를 생성하고 있어요</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center text-[#388E3C]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  </motion.div>
                  가족 스페이스가 생성되었습니다! 🎉
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Card className="border border-[#81C784] bg-[#F1F8E9]">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className="text-4xl mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      🌱
                    </motion.div>
                    <h3 className="font-semibold text-[#388E3C] mb-2">{familyName}</h3>
                    <p className="text-sm text-[#4E342E] mb-4">가족들을 초대해보세요!</p>

                    <div className="bg-white p-3 rounded-lg border border-[#81C784] mb-4">
                      <Label className="text-xs text-[#4E342E] opacity-70">초대 코드</Label>
                      <div className="flex items-center justify-center mt-1">
                        <Badge className="bg-[#388E3C] text-white text-lg px-4 py-2 font-mono">
                          {inviteCode}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        className="flex-1 border-[#81C784] text-[#388E3C] hover:bg-[#F1F8E9]"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? '복사됨' : '복사'}
                      </Button>
                      <Button
                        onClick={handleShareKakao}
                        className="flex-1 bg-[#FEE500] hover:bg-[#FFEB3B] text-black"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        카톡 공유
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💡 초대 방법</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. 위의 초대 코드를 가족들에게 공유하세요</li>
                    <li>2. 가족들이 MODi 앱에서 "가족 스페이스 참여"를 선택</li>
                    <li>3. 초대 코드를 입력하면 가족 스페이스에 참여됩니다</li>
                  </ol>
                </div>

                <Button onClick={handleConfirm} className="w-full bg-[#81C784] hover:bg-[#388E3C]">
                  확인
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
