'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlantStatus } from '@/hooks/use-plant-status';
import { useToast } from '@/hooks/use-toast';
import { FamilySpaceHeader } from '@/components/family-space/FamilySpaceHeader';
import { PlantSection } from '@/components/family-space/PlantSection';
import { FamilyMemberSection } from '@/components/family-space/FamilyMemberSection';
import { FamilyRecommendationCard } from '@/components/family-space/FamilyRecommendationCard';
import { MessageCardSection } from '@/components/family-space/MessageCardSection';
import { FamilyMember } from '@/types/family-space.type';

export default function FamilySpacePage() {
  // ==========================================
  // 🌍 전역/공유 상태 - 상위 컴포넌트에서 관리
  // ==========================================

  // 가족 관련 상태 (여러 컴포넌트에서 공유)
  const [inviteCode, setInviteCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [copied, setCopied] = useState(false);

  // TODO: API 연동 시 추가할 훅들
  // const { data: familyData, isLoading } = useFamilyQuery();
  // const { mutate: generateInviteCode } = useGenerateInviteCodeMutation();
  // const { mutate: updateFamilyName } = useUpdateFamilyNameMutation();

  // ==========================================
  // 🔧 개별 기능 - 각 컴포넌트에서 관리 예정
  // ==========================================
  // PlantSection: usePlantQuery, useWaterPlantMutation
  // MessageCardSection: useMessageCardsQuery, useCreateMessageCardMutation
  // FamilyRecommendationCard: useRecommendationQuery

  const { hasPlant, plantType } = usePlantStatus();
  const router = useRouter();
  const { toast } = useToast();

  // 임시 가족 데이터 (추후 API로 대체)
  const familyData: FamilyMember[] = [
    {
      id: 1,
      name: '엄마',
      avatar: '🐛',
      plan: 'LTE 무제한 요금제',
      hasRecommendation: false,
    },
    {
      id: 2,
      name: '아빠',
      avatar: '👤',
      plan: '5G 프리미엄 요금제',
      hasRecommendation: true,
    },
    {
      id: 3,
      name: '나',
      avatar: '🐞',
      plan: '5G 슈퍼 요금제',
      hasRecommendation: false,
    },
  ];

  useEffect(() => {
    const savedInviteCode = localStorage.getItem('familyInviteCode');
    const savedFamilyName = localStorage.getItem('familyName');
    if (savedInviteCode) setInviteCode(savedInviteCode);
    if (savedFamilyName) setFamilyName(savedFamilyName);
  }, []);

  // ==========================================
  // 🎯 전역 상태 관련 핸들러들
  // ==========================================

  const handlePlantAction = () => {
    if (hasPlant) {
      router.push('/plant-game');
    } else {
      router.push('/plant-selection');
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

  const handleShareKakao = () => {
    if (!inviteCode || !familyName) return;

    const shareText = `🌱 MODi 가족 스페이스에 초대합니다!\n\n가족 이름: ${familyName}\n초대 코드: ${inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi 앱 다운로드: https://modi.app`;

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

  const generateNewInviteCode = () => {
    // TODO: API 연동 시 generateInviteCode() 뮤테이션 호출
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const defaultFamilyName = '우리 가족';

    setInviteCode(newCode);
    setFamilyName(defaultFamilyName);

    localStorage.setItem('familyInviteCode', newCode);
    localStorage.setItem('familyName', defaultFamilyName);

    toast({
      title: '초대 코드가 생성되었습니다! 🎉',
      description: '이제 가족들을 초대할 수 있어요.',
    });
  };

  const handleSaveFamilyName = (name: string) => {
    // TODO: API 연동 시 updateFamilyName() 뮤테이션 호출
    setFamilyName(name);
    localStorage.setItem('familyName', name);
    toast({
      title: '가족명이 변경되었습니다! ✨',
      description: `새로운 가족명: ${name}`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <FamilySpaceHeader />

      {/* Plant Section - 독립적으로 API 관리 */}
      <PlantSection
        hasPlant={hasPlant}
        plantType={plantType || undefined}
        onPlantAction={handlePlantAction}
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 space-y-6 pb-6">
          {/* Family Section - 공유 데이터 사용 */}
          <FamilyMemberSection
            members={familyData}
            inviteCode={inviteCode}
            familyName={familyName}
            onGenerateCode={generateNewInviteCode}
            onCopyCode={handleCopyCode}
            onShareKakao={handleShareKakao}
            onSaveFamilyName={handleSaveFamilyName}
            copied={copied}
          />

          {/* Recommendation Section - 독립적으로 API 관리 */}
          <FamilyRecommendationCard />

          {/* Message Card Section - 독립적으로 API 관리 */}
          <MessageCardSection />
        </div>
      </div>
    </div>
  );
}
