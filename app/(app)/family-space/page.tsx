'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useFamily } from '@/hooks/family';
import { useAuth } from '@/hooks/useAuth';
import { FamilySpaceHeader } from '@/components/family-space/FamilySpaceHeader';
import { PlantSection } from '@/components/family-space/PlantSection';
import { FamilyMemberSection } from '@/components/family-space/FamilyMemberSection';
import { FamilyRecommendationCard } from '@/components/family-space/FamilyRecommendationCard';
import { MessageCardSection } from '@/components/family-space/MessageCardSection';
import { UIFamilyMember } from '@/types/family.type';

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
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePlantAction = () => {
    const plant = family?.plant;
    if (plant?.hasPlant) {
      router.push('/plant-game');
    } else if (plant?.canCreateNew) {
      router.push('/plant-selection');
    } else {
      toast({
        title: '새싹을 만들 수 없습니다',
        description: plant?.createBlockReason || '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyCode = async () => {
    if (!family?.family?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(family.family.inviteCode);
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
    if (!family?.family?.inviteCode || !family?.family?.name) return;

    const shareText = `🌱 MODi 가족 스페이스에 초대합니다!\n\n가족 이름: ${family.family.name}\n초대 코드: ${family.family.inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi: https://modi.app`;

    if (navigator.share) {
      navigator
        .share({
          title: 'MODi 가족 스페이스 초대',
          text: shareText,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText);
          toast({
            title: '공유 링크가 복사되었습니다!',
            description: '카카오톡에서 붙여넣기 해주세요.',
          });
        });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: '공유 메시지가 복사되었습니다!',
        description: '카카오톡에서 붙여넣기 해주세요.',
      });
    }
  };

  const handleGenerateNewInviteCode = () => {
    if (!familyId) return;

    generateNewCode(familyId);
  };

  const handleSaveFamilyName = (name: string) => {
    // TODO: 가족명 변경 API 연동 필요
    toast({
      title: '가족명이 변경되었습니다! ✨',
      description: `새로운 가족명: ${name}`,
    });
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
      plan: member.planSummary || '요금제 없음',
      hasRecommendation: false, // TODO: 추천 시스템 연동 필요
    })) || [];

  // ==========================================
  // 🚨 에러 처리
  // ==========================================
  useEffect(() => {
    if (error) {
      toast({
        title: '가족 정보를 불러오는데 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (messageCardsError) {
      toast({
        title: '메시지 카드를 불러오는데 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  }, [messageCardsError, toast]);

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
            onViewRecommendation={() => {
              // TODO: 추천 페이지로 이동
              toast({
                title: '추천 페이지로 이동합니다',
                description: '곧 구현될 예정입니다.',
              });
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
          />
        </div>
      </div>
    </div>
  );
}
