'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FamilyWateringStatus } from '@/components/plant-game/FamilyWateringStatus';
import { PlantImageDisplay } from '@/components/plant-game/PlantImageDisplay';
import { PlantProgressBar } from '@/components/plant-game/PlantProgressBar';
import { PlantActionButtons } from '@/components/plant-game/PlantActionButtons';
import { ClaimRewardButton } from '@/components/plant-game/ClaimRewardButton';
import { RewardModal } from '@/components/plant-game/RewardModal';
import { MissionSheet } from '@/components/plant-game/MissionSheet';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useFamily, useMessageCardsManager } from '@/hooks/family';
import {
  useAddPoint,
  useCheckTodayActivity,
  usePlantStatus,
  useNutrientStatus,
  useClaimReward,
} from "@/hooks/plant";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePlantSocket } from "@/hooks/plant/usePlantSocket";
import { ActivityType, PlantEventData, RewardHistory } from "@/types/plants.type";
import { useAuth } from "@/hooks/useAuth";
import { plantApi } from "@/lib/api/plant";
import { FamilyMember } from "@/types/family.type";
import { CardMatchingGame } from "@/components/plant-game/CardMatchingGame";
import { useGenerateInviteCode, useUpdateFamilyName } from "@/hooks/family/useFamilyMutations";
import { MessageCardCreator } from "@/components/family-space/MessageCardCreator";
import { InviteCodeModal } from "@/components/family-space/InviteCodeModal";
import { QuizPage } from "@/components/plant-game/QuizPage";
import { useKakaoInit } from "@/hooks/useKakaoShare";
import { ModernPlantPage } from "@/components/plant-game/modern-plant-page";
import { useKakaoInit, shareKakao } from "@/hooks/useKakaoShare";
import MissionBtn from '@/components/plant-game/MissionBtn';
import { usePlantGameStore } from '@/store/usePlantGameStore';

declare global {
  interface Window {
    Kakao: any;
  }
}
// ==========================================
// 🌱 새싹 키우기 게임 메인 컴포넌트
// ==========================================
export default function PlantGamePage() {
  // ==========================================
  // 🎮 게임 상태 관리
  // ==========================================
  const {
    showMissions, setShowMissions,
    showRewardModal, setShowRewardModal,
    rewardData, setRewardData,
    currentLevel, setCurrentLevel,
    currentProgress, setCurrentProgress,
    handleClaimRewardClick,
    showQuizPage, setShowQuizPage,
  } = usePlantGameStore();

  // ==========================================
  // 🌱 활동 상태 관리
  // ==========================================
  const [isWatering, setIsWatering] = useState(false); // 물주기 애니메이션 상태
  const [isFeeding, setIsFeeding] = useState(false); // 영양제 주기 애니메이션 상태
  const [alreadyWatered, setAlreadyWatered] = useState(false); // 오늘 물주기 완료 여부
  const [alreadyFed, setAlreadyFed] = useState(false); // 오늘 영양제 주기 완료 여부

  // ==========================================
  // 👨‍👩‍👧‍👦 가족 구성원 상태 관리
  // ==========================================
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]); // 가족 구성원 목록
  const [wateredMemberIds, setWateredMemberIds] = useState<number[]>([]); // 오늘 물주기 완료한 구성원 ID 목록

  // ==========================================
  // 🔐 인증 및 사용자 정보
  // ==========================================
  const { user } = useAuth(); // 현재 로그인한 사용자 정보

  // ==========================================
  // 🔌 API 훅 및 데이터
  // ==========================================
  const { familyId, family } = useFamily(); // 가족 정보 및 ID

  // 식물 상태 정보
  const {
    data: plantStatus,
    isLoading: isPlantLoading,
    error: plantError,
  } = usePlantStatus(familyId ?? 0);

  // 오늘 활동 완료 여부 확인
  const { data: checkAlreadyWatered } = useCheckTodayActivity("water");
  const { data: checkAlreadyFed } = useCheckTodayActivity("nutrient");
  const { data: nutrientCount = 0 } = useNutrientStatus(); // 영양제 개수

  // 포인트 적립 및 보상 수령 API
  const { mutate: addPoint, isPending } = useAddPoint();

  // 쿼리 클라이언트 (캐시 무효화용)
  const queryClient = useQueryClient();

  // ==========================================
  // 🔄 초기화 및 상태 관리
  // ==========================================
  const [initialized, setInitialized] = useState(false);

  // 카카오톡 SDK 초기화
  useKakaoInit();

  // 서버 응답으로 최초 상태 세팅 (소켓보다 우선 적용)
  useEffect(() => {
    if (plantStatus && !initialized) {
      setCurrentLevel(plantStatus.level);
      setCurrentProgress(
        Math.floor((plantStatus.experiencePoint / plantStatus.expThreshold) * 100)
      );
      setInitialized(true);
    }
  }, [plantStatus, initialized]);

  // ==========================================
  // 📊 가족 구성원 데이터 관리
  // ==========================================

  // 가족 구성원 정보 설정
  useEffect(() => {
    if (family?.members) {
      setFamilyMembers(family.members);
    }
  }, [family]);

  // 물주기 완료된 구성원 조회
  const fetchWateredMembers = useCallback(async () => {
    if (!familyId) return;
    try {
      const wateredIds = await plantApi.getWaterMembers(familyId);
      setWateredMemberIds(wateredIds);
    } catch (error) {
      console.error("물주기 완료 구성원 조회 실패:", error);
    }
  }, [familyId]);

  // 초기 로딩 시 물주기 완료 구성원 조회
  useEffect(() => {
    fetchWateredMembers();
  }, [fetchWateredMembers]);

  // ==========================================
  // 🔄 실시간 소켓 연결 및 이벤트 처리
  // ==========================================

  // 실시간 식물 활동 소켓 연결
  usePlantSocket(
    familyId ?? 0,
    useCallback(
      (event: PlantEventData) => {
        // 레벨과 경험치 업데이트 (모든 이벤트에서)
        setCurrentLevel(event.level);
        setCurrentProgress(Math.floor((event.experiencePoint / event.expThreshold) * 100));

        // 레벨업 토스트 표시
        if (event.isLevelUp) {
          toast.success("🎉 레벨업! 식물이 성장했습니다!");
        }

        // 활동 타입별 처리
        switch (event.type) {
          case "water":
            // 현재 사용자의 활동인 경우에만 상태 변경
            if (event.name === user?.nickname) {
              setAlreadyWatered(true);
            }
            // 물주기 완료된 구성원 목록 업데이트
            fetchWateredMembers();
            toast.success(`${event.name}님이 물을 주었습니다! 💧`);
            break;

          case "nutrient":
            // 현재 사용자의 활동인 경우에만 상태 변경
            if (event.name === user?.nickname) {
              setAlreadyFed(true);
            }
            // 영양제 사용 시 영양제 개수 감소 (서버에서 업데이트된 값으로 동기화)
            queryClient.invalidateQueries({ queryKey: ["plant-status", familyId] });
            toast.success(`${event.name}님이 영양제를 주었습니다! 🌱`);
            break;

          default:
          // console.log("알 수 없는 활동 타입:", event.type);
        }
      },
      [familyId, queryClient, user?.nickname, fetchWateredMembers]
    )
  );

  // ==========================================
  // 💧 물주기 활동 처리
  // ==========================================

  /**
   * 물주기 처리 (하루에 한번 제한)
   * 포인트 적립 및 실시간 상태 업데이트
   */
  const handleWatering = () => {
    // 중복 요청 방지
    if (isPending || alreadyWatered) {
      toast.warning("오늘은 이미 물을 주었어요 💧");
      return;
    }

    setIsWatering(true);
    console.log('Water effect started');

    addPoint(
      { activityType: "water" },
      {
        onSuccess: () => {
          toast.success("물주기 완료!");
          setAlreadyWatered(true);
          queryClient.invalidateQueries({ queryKey: ["activity", "check-today", "water"] });
          // 식물 상태 업데이트를 위해 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ["plant-status", familyId] });
          // 물주기 완료된 구성원 목록 업데이트
          fetchWateredMembers();
          // 애니메이션이 끝나고 나서 상태를 false로 변경
          setTimeout(() => {
            console.log('Water effect ended');
            setIsWatering(false);
          }, 3000);
        },
        onError: (error) => {
          setIsWatering(false);
          console.log('Water effect error');
        },
      }
    );
  };

  // ==========================================
  // 🌱 영양제 주기 활동 처리
  // ==========================================

  /**
   * 영양제 주기 처리 (하루에 한번 제한)
   * 영양제 개수 확인 및 포인트 적립
   */
  const handleFeeding = async () => {
    // 중복 요청 방지
    if (isPending || alreadyFed) {
      toast.warning("오늘은 이미 영양제를 주었어요 🌿");
      return;
    }

    // 서버에서 최신 영양제 개수 확인
    try {
      const serverNutrientCount = await plantApi.getNutrients();

      if (serverNutrientCount <= 0) {
        toast.warning("영양제가 부족합니다! 미션을 완료해서 영양제를 얻어보세요! 🎯");
        return;
      }
    } catch (error) {
      // 서버 확인 실패 시 로컬 상태로 판단
      if (nutrientCount <= 0) {
        toast.warning("영양제가 부족합니다! 미션을 완료해서 영양제를 얻어보세요! 🎯");
        return;
      }
    }

    setIsFeeding(true);

    addPoint(
      { activityType: "nutrient" },
      {
        onSuccess: () => {
          toast.success("영양제 주기 완료! 포인트 적립 ✅");
          setAlreadyFed(true);
          setTimeout(() => setIsFeeding(false), 2000);
          queryClient.invalidateQueries({ queryKey: ["activity", "check-today", "nutrient"] });
          queryClient.invalidateQueries({ queryKey: ["plant-status", familyId] });
          // 영양제 개수 업데이트를 위해 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ["nutrient", "stock"] });
        },
        onError: (error) => {
          setIsFeeding(false);
        },
      }
    );
  };

  // ==========================================
  // 🔄 활동 상태 동기화
  // ==========================================

  // 서버에서 받은 물주기 상태로 로컬 상태 동기화
  useEffect(() => {
    setAlreadyWatered(!!checkAlreadyWatered);
  }, [checkAlreadyWatered]);

  // 서버에서 받은 영양제 상태로 로컬 상태 동기화
  useEffect(() => {
    setAlreadyFed(!!checkAlreadyFed);
  }, [checkAlreadyFed]);
  // ==========================================
  // 🎨 UI 데이터 변환
  // ==========================================

  /**
   * FamilyWateringStatus 컴포넌트에 전달할 데이터 변환
   * 서버 데이터를 UI 컴포넌트에 맞는 형태로 변환
   */
  const transformedMembers = familyMembers.map((member) => ({
    id: member.uid,
    name: member.name,
    avatar: member.profileImage || "👤", // 카카오 프로필 이미지 또는 기본 이모지
    hasWatered: wateredMemberIds.includes(member.uid),
    status: wateredMemberIds.includes(member.uid) ? "물주기 완료" : "",
  }));

  // ==========================================
  // 🚀 로딩 상태 처리
  // ==========================================
  if (isPlantLoading || !plantStatus) {
    return (
      <div className="flex justify-center items-center h-[100dvh] bg-white text-gray-700 text-lg">
        🌱 식물 상태 불러오는 중...
      </div>
    );
  }

  // ==========================================
  // 🎮 UI 렌더링
  // ==========================================
  return (
    <div className="h-full bg-gradient-to-b from-blue-100 to-blue-50 max-w-md mx-auto flex flex-col overflow-hidden">
      {/* 📱 헤더 영역 */}
      <div className="flex items-center justify-between p-3 flex-shrink-0">
        <Link href="/family-space">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-center w-full text-gray-900">새싹 키우기</h1>
        <div className="w-6 h-6"></div> {/* 헤더 균형을 위한 빈 공간 */}
      </div>

      {/* 👨‍👩‍👧‍👦 가족 구성원 상태 */}
      {currentLevel !== 5 && (
        <FamilyWateringStatus members={transformedMembers} />
      )}

      {/* 🎯 미션하기 버튼 */}
      {currentLevel !== 5 && (
        <MissionBtn />
      )}

      {/* 🌱 식물 이미지 영역 */}
      {currentLevel === 5 ? (
        <div className="flex-1 flex items-center justify-center px-0 py-0 h-full w-full">
          <PlantImageDisplay
            selectedPlantType={plantStatus?.plantType}
            currentLevel={currentLevel}
            isWatering={isWatering}
            isFeeding={isFeeding}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-4 h-full w-full">
          <PlantImageDisplay
            selectedPlantType={plantStatus?.plantType}
            currentLevel={currentLevel}
            isWatering={isWatering}
            isFeeding={isFeeding}
          />
        </div>
      )}

      {/* 🎮 게임 컨트롤 영역 */}
      <div className="flex-shrink-0 p-3">
        {currentLevel === 5 ? (
          <ClaimRewardButton />
        ) : (
          <>
            <PlantProgressBar level={currentLevel} progress={currentProgress} fid={familyId ?? 0} />
            <PlantActionButtons
              onWater={handleWatering}
              onFeed={handleFeeding}
              disabled={isPending}
              checkingWater={isWatering}
              alreadyWatered={alreadyWatered}
              checkingFeed={isFeeding}
              alreadyFed={alreadyFed}
            />
          </>
        )}
      </div>

      {/* 📋 미션 시트 모달 */}
      <AnimatePresence>
        {showMissions && (
          <MissionSheet />
        )}
      </AnimatePresence>

      {/* 🎁 보상 모달 */}
      <AnimatePresence>
        {showRewardModal && (
          <RewardModal
            isOpen={showRewardModal}
            onClose={() => setShowRewardModal(false)}
            plantType={plantStatus?.plantType!}
            rewardData={rewardData || undefined}
          />
        )}
      </AnimatePresence>

      {/* 🎯 퀴즈 페이지 */}
      {showQuizPage && (
        <div className="fixed inset-0 z-50">
          <QuizPage
            onBack={() => setShowQuizPage(false)}
            onQuizComplete={() => {
              addPoint({ activityType: "quiz" });
              toast.success("퀴즈 완료! 경험치가 적립되었습니다. 🎯");
              setShowQuizPage(false);
            }}
          />
        </div>
      )}

      {/* 항상 존재하는 모달 컴포넌트 */}
      <CardMatchingGame />
      <MessageCardCreator />
      <InviteCodeModal />
    </div>
  );
}
