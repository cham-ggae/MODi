'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useFamily } from '@/hooks/family';
import { useAuth } from '@/hooks/useAuth';
import { FamilySpaceHeader } from '@/components/family-space/FamilySpaceHeader';
import { PlantSection } from '@/components/family-space/PlantSection';
import { FamilyMemberSection } from '@/components/family-space/FamilyMemberSection';
import { FamilyRecommendationCard } from '@/components/family-space/FamilyRecommendationCard';
import { MessageCardSection } from '@/components/family-space/MessageCardSection';
import { RewardHistorySection } from '@/components/family-space/RewardHistorySection';
import { UIFamilyMember } from '@/types/family.type';
import { plantApi } from '@/lib/api/plant';
import { PlantStatus } from '@/types/plants.type';
import { MessageCardModal } from '@/components/message-card-modal';
import { useAddPoint } from '@/hooks/plant';
import { usePlantStatus } from '@/hooks/plant/usePlantStatus';
import { useUpdateFamilyName } from '@/hooks/family/useFamilyMutations';

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function FamilySpacePage() {
  const {
    // 데이터
    family,
    dashboard,
    messageCards,
    hasFamily,
    familyId,
    memberCount,
    canInvite,

    // 로딩 상태
    isLoading,
    isCreating,
    isJoining,
    isLeaving,
    isGeneratingCode,
    isLoadingMessageCards,

    // 에러
    error,
    messageCardsError,

    // 액션
    createFamily,
    joinFamily,
    leaveFamily,
    generateNewCode,

    // 유틸리티
    refetch,
  } = useFamily();

  const [copied, setCopied] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessageCardCreator, setShowMessageCardCreator] = useState(false);

  const router = useRouter();
  const { user } = useAuth();
  const { mutate: updateFamilyName } = useUpdateFamilyName();
  const { mutate: addPoint } = useAddPoint();

  const { data: plantStatus, error: plantStatusError } = usePlantStatus(familyId ?? 0);

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
          console.log('✅ 카카오 SDK 스크립트 로드 완료');
          resolve();
        };
        script.onerror = () => {
          console.error('❌ 카카오 SDK 스크립트 로드 실패');
          reject(new Error('카카오 SDK 스크립트 로드 실패'));
        };
        document.head.appendChild(script);
      });
    };

    const initKakao = async () => {
      try {
        console.log('🔍 카카오 SDK 초기화 시도:', {
          windowExists: typeof window !== 'undefined',
          windowKakao: typeof window !== 'undefined' ? !!window.Kakao : false,
          isInitialized:
            typeof window !== 'undefined' && window.Kakao ? window.Kakao.isInitialized() : false,
          jsKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
        });

        // SDK 로드 대기
        await loadKakaoSDK();

        if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
          console.log('✅ 카카오 SDK 초기화 실행');
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          console.log('✅ 카카오 SDK 초기화 완료');
        }
      } catch (error) {
        console.error('❌ 카카오 SDK 초기화 실패:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initKakao();
    }
  }, []);

  const daysAfterFamilyCreation = (() => {
    if (family?.family?.daysAfterCreation !== undefined) {
      return family.family.daysAfterCreation;
    }
    if (family?.family?.createdAt) {
      const createdAt = new Date(family.family.createdAt);
      const today = new Date();
      const createdDate = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate()
      );
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffTime = todayDate.getTime() - createdDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return 0;
  })();

  const plantType = family?.plant?.plantType; // "flower" or "tree"
  const plantImage =
    plantType === 'tree' ? '/public/images/tree1.png' : '/public/images/flower1.png';

  const handlePlantAction = () => {
    // 2인 이상 체크
    if (memberCount < 2) {
      toast.error('2인 이상부터 새싹을 만들 수 있어요! 가족을 더 초대해보세요.');
      return;
    }
    // 식물 상태(react-query) 기준으로 분기
    if (plantStatus && !plantStatus.completed) {
      router.push('/plant-game');
      return;
    }
    // 완료됐거나 없으면 생성 화면으로
    router.push('/plant-selection');
  };

  const handleCopyCode = async () => {
    if (!family?.family?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(family.family.inviteCode);
      setCopied(true);
      toast.success('초대 코드가 복사되었습니다! 가족들에게 공유해보세요.');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleShareKakao = () => {
    if (!family?.family?.inviteCode || !family?.family?.name) return;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const imageUrl = `${baseUrl}/images/modi-logo-small.png`;

    console.log('🔍 카카오 공유 시도:', {
      windowKakao: !!window.Kakao,
      isInitialized: window.Kakao?.isInitialized?.(),
      familyName: family.family.name,
      inviteCode: family.family.inviteCode,
      imageUrl,
    });

    // 카카오톡 공유만 사용하고 브라우저 공유 기능은 제거
    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log('✅ 카카오 SDK 초기화됨, 공유 실행');
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: `🌱 ${family.family.name} 가족 스페이스에 초대합니다!`,
          description: `함께 식물을 키우고 요금제도 절약해요!\n초대 코드: ${family.family.inviteCode}`,
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
      console.log('❌ 카카오 SDK 초기화 안됨, 클립보드 복사로 대체');
      // 카카오톡 SDK가 없는 경우 클립보드에 복사
      const shareText = `🌱 ${family.family.name} 가족 스페이스에 초대합니다!\n\n초대 코드: ${family.family.inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi: https://modi.app`;
      navigator.clipboard.writeText(shareText);
      toast.success('공유 메시지가 복사되었습니다! 카카오톡에서 붙여넣기 해주세요.');
    }
  };

  const handleGenerateNewInviteCode = () => {
    if (!familyId) return;

    generateNewCode(familyId);
  };

  const handleSaveFamilyName = (name: string) => {
    if (!familyId) {
      toast.error('가족 ID를 찾을 수 없습니다.');
      return;
    }

    updateFamilyName(
      { fid: familyId, name },
      {
        onSuccess: () => {
          toast.success(`가족명이 변경되었습니다! ✨ 새로운 가족명: ${name}`);
        },
        onError: (error) => {
          toast.error('가족명 변경에 실패했습니다');
        },
      }
    );
  };

  const handleSendCard = (design: string, message: string) => {
    // 메시지 저장 로직...
    addPoint({ activityType: 'emotion' });
    setShowMessageModal(false);
  };

  const handleMessageCardCreated = () => {
    // 메시지 카드 생성 후 포인트 적립
    addPoint({ activityType: 'emotion' });
    toast.success('메시지 카드를 생성했습니다! 💌 경험치가 적립되었습니다.');
    setShowMessageCardCreator(false);
  };

  // ==========================================
  // 📊 데이터 변환 및 준비
  // ==========================================

  // API 데이터를 컴포넌트에서 사용할 형태로 변환
  const transformedMembers: UIFamilyMember[] =
    dashboard?.members?.map((member) => ({
      id: member.uid,
      name: member.name,
      avatar: member.profileImage ? '👤' : '🐛', // 프로필 이미지가 있으면 기본 아바타, 없으면 랜덤
      profileImage: member.profileImage, // 카카오톡 프로필 이미지
      bugId: member.bugId, // 실제 벌레 ID
      surveyDate: member.surveyDate, // 설문조사 완료 날짜
      hasSurveyCompleted: !!member.bugId && !!member.surveyDate, // bugId와 surveyDate가 있으면 설문조사 완료
      recommendedPlans: member.recommendedPlans, // 추천 요금제 목록
      currentPlan: member.planName
        ? {
            planName: member.planName,
            price: member.price || 0,
            planSummary: member.planSummary || '요금제 없음',
          }
        : undefined,
    })) || [];

  // ==========================================
  // 🚨 에러 처리
  // ==========================================
  useEffect(() => {
    if (error) {
      toast.error('가족 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  useEffect(() => {
    if (messageCardsError) {
      toast.error('메시지 카드를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [messageCardsError]);

  useEffect(() => {
    if (plantStatusError) {
      toast.error('식물 상태를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [plantStatusError]);

  // ==========================================
  // 🔄 가족 스페이스 리다이렉트 처리
  // ==========================================
  useEffect(() => {
    // 로딩이 완료되고 가족이 없는 경우 family-space-intro로 리다이렉트
    if (!isLoading && !hasFamily) {
      console.log('🔄 가족 스페이스가 없어서 family-space-intro로 리다이렉트');
      router.push('/family-space-tutorial');
    }
  }, [isLoading, hasFamily, router]);

  // ==========================================
  // 🎨 로딩 상태 처리
  // ==========================================
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">가족 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 가족이 없는 경우 로딩 화면 표시 (리다이렉트 중)
  if (!hasFamily) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">페이지로 이동하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <FamilySpaceHeader />

      {/* Plant Section */}
      <PlantSection
        plant={family?.plant || { hasPlant: false, canCreateNew: false }}
        plantStatus={plantStatus}
        onPlantAction={handlePlantAction}
        familyNutrial={family?.family?.nutrial}
        familyDaysAfterCreation={family?.family?.daysAfterCreation}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 space-y-6 pb-6">
          {/* Family Section */}
          <FamilyMemberSection
            members={transformedMembers}
            inviteCode={family?.family?.inviteCode || ''}
            familyName={family?.family?.name || ''}
            onGenerateCode={handleGenerateNewInviteCode}
            onCopyCode={handleCopyCode}
            onShareKakao={handleShareKakao}
            onSaveFamilyName={handleSaveFamilyName}
            copied={copied}
            isLoading={isGeneratingCode}
            canInvite={canInvite}
            memberCount={memberCount}
          />

          {/* Recommendation Section */}
          <FamilyRecommendationCard
            combiType={family?.family?.combiType}
            memberCount={dashboard?.totalMembers}
            membersWithPlan={dashboard?.membersWithPlan}
            discountInfo={dashboard?.discount}
            onViewRecommendation={() => {
              // 가족 추천 페이지로 이동
              router.push('/family-recommendation');
            }}
          />

          {/* Message Card Section */}
          <MessageCardSection
            familyId={familyId}
            members={transformedMembers}
            memberCount={memberCount}
            messageCards={messageCards?.cards || []}
            totalCount={messageCards?.totalCount || 0}
            isLoading={isLoadingMessageCards}
            onMessageCardCreated={handleMessageCardCreated}
          />

          {/* Reward History Section */}
          <RewardHistorySection />
        </div>
      </div>

      {showMessageModal && (
        <MessageCardModal onSendCard={handleSendCard}>
          <></>
        </MessageCardModal>
      )}
    </div>
  );
}
