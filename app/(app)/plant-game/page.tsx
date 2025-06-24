'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { FamilyWateringStatus } from '@/components/plant-game/FamilyWateringStatus';
import { PlantImageDisplay } from '@/components/plant-game/PlantImageDisplay';
import { PlantProgressBar } from '@/components/plant-game/PlantProgressBar';
import { PlantActionButtons } from '@/components/plant-game/PlantActionButtons';
import { ClaimRewardButton } from '@/components/plant-game/ClaimRewardButton';
import { RewardModal } from '@/components/plant-game/RewardModal';
import { MissionSheet } from '@/components/plant-game/MissionSheet';
import { Mission } from '@/types/plant-game.type';
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
import { Sprout, TreePine } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { CardMatchingGame } from "@/components/plant-game/CardMatchingGame";
import { useGenerateInviteCode, useUpdateFamilyName } from "@/hooks/family/useFamilyMutations";
import { MessageCardCreator } from "@/components/family-space/MessageCardCreator";
import { InviteCodeModal } from "@/components/family-space/InviteCodeModal";
import { QuizPage } from "@/components/plant-game/QuizPage";
import { useKakaoInit } from "@/hooks/useKakaoShare";

declare global {
  interface Window {
    Kakao: any;
  }
}

// ==========================================
// 🎮 새싹 키우기 게임 메인 페이지
// ==========================================
/**
 * 새싹 키우기 게임 메인 페이지
 *
 * 주요 기능:
 * - 실시간 가족 구성원 물주기 상태 표시
 * - 식물 레벨별 성장 시각화 (1~5레벨)
 * - 하루 한번 제한된 물주기/영양제 활동
 * - 소켓을 통한 실시간 동기화
 * - 미션 시스템 연동 (출석, 메시지, 퀴즈, 카드게임, 가족등록, 설문)
 * - 5레벨 달성 시 보상 시스템
 */

// ==========================================
// 🎯 미션 데이터 정의
// ==========================================
const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "1일 1회 출석하기",
    description: "매일 밤 12시에 다시 시작됩니다.",
    icon: "✏️",
    reward: "출석하기",
    activityType: "attendance",
  },
  {
    id: 2,
    title: "가족에게 메세지 남기기",
    description: "사랑하는 가족에게 작은 한마디",
    icon: "💌",
    reward: "메세지 작성",
    activityType: "emotion",
  },
  {
    id: 3,
    title: "요금제 퀴즈 풀기",
    description: "더 많은 할인이 기다릴지도?",
    icon: "🎯",
    reward: "퀴즈 풀기",
    activityType: "quiz",
  },
  {
    id: 4,
    title: "골라 골라 오늘의 요금제",
    description: "카들르 맞히고 요금제를 알아봐!!",
    icon: "🎲",
    reward: "카드 맞히기",
    activityType: "lastleaf",
  },
  {
    id: 5,
    title: "가족 등록",
    description: "가족 등록하고 더 많은 보상을 받아보세요!",
    icon: "👨‍👩‍👧‍👦",
    reward: "초대하기",
    activityType: "register",
  },
  {
    id: 6,
    title: "통신 성향 검사",
    description: "나에게 맞는 통신 캐릭터는?",
    icon: "💬",
    reward: "검사하기",
    activityType: "survey",
  },
];

// ==========================================
// 🎲 선택형 모달 컴포넌트
// ==========================================
function ChoiceModal({
  title,
  options,
  onSubmit,
  onClose,
  direction = "row",
}: {
  title: string;
  options: string[];
  onSubmit: (choice: string) => void;
  onClose: () => void;
  direction?: "row" | "col";
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-80 flex flex-col items-center">
        <div className="text-lg font-bold mb-4">{title}</div>
        <div className={`flex mb-4 gap-2 ${direction === "row" ? "flex-row" : "flex-col"}`}>
          {options.map((opt) => (
            <button
              key={opt}
              className={`px-4 py-2 rounded-lg border ${
                selected === opt ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:bg-gray-300"
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
        >
          확인
        </button>
        <button className="mt-2 text-xs text-gray-400" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 🌱 새싹 키우기 게임 메인 컴포넌트
// ==========================================
export default function PlantGamePage() {
  // ==========================================
  // 🎮 게임 상태 관리
  // ==========================================
  const [showMissions, setShowMissions] = useState(false); // 미션 시트 표시 여부
  const [showRewardModal, setShowRewardModal] = useState(false); // 보상 모달 표시 여부
  const [rewardData, setRewardData] = useState<RewardHistory | null>(null); // 보상 데이터
  const [currentLevel, setCurrentLevel] = useState(1); // 현재 식물 레벨
  const [currentProgress, setCurrentProgress] = useState(0); // 현재 경험치 진행률

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
  // 🎯 모달 상태 관리
  // ==========================================
  const [showQuizModal, setShowQuizModal] = useState(false); // 퀴즈 모달 표시 여부
  const [showCardMatchingGame, setShowCardMatchingGame] = useState(false); // 카드 매칭 게임 표시 여부
  const [showMessageCardCreator, setShowMessageCardCreator] = useState(false); // 메시지 카드 생성기 표시 여부
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false); // 초대 코드 모달 표시 여부
  const [showQuizPage, setShowQuizPage] = useState(false); // 퀴즈 페이지 표시 여부
  const [copied, setCopied] = useState(false); // 초대 코드 복사 상태

  // ==========================================
  // 🔐 인증 및 사용자 정보
  // ==========================================
  const { user } = useAuth(); // 현재 로그인한 사용자 정보

  // ==========================================
  // 🔌 API 훅 및 데이터
  // ==========================================
  const { familyId, family } = useFamily(); // 가족 정보 및 ID
  const { mutate: generateNewCode } = useGenerateInviteCode(); // 초대 코드 생성 API
  const { mutate: updateFamilyName, isPending: isUpdatingFamilyName } = useUpdateFamilyName(); // 가족명 업데이트 API

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
  const { mutate: claimReward, isPending: isClaiming } = useClaimReward();

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

    addPoint(
      { activityType: "water" },
      {
        onSuccess: () => {
          toast.success("물주기 완료!");
          setAlreadyWatered(true);
          setTimeout(() => setIsWatering(false), 2000);
          queryClient.invalidateQueries({ queryKey: ["activity", "check-today", "water"] });
          // 식물 상태 업데이트를 위해 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ["plant-status", familyId] });
          // 물주기 완료된 구성원 목록 업데이트
          fetchWateredMembers();
        },
        onError: (error) => {
          setIsWatering(false);
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
  // 🎁 보상 시스템
  // ==========================================

  /**
   * 보상 수령 버튼 클릭 핸들러
   * 5레벨 달성 시 보상 수령 및 confetti 효과
   */
  const handleClaimRewardClick = () => {
    if (currentLevel === 5) {
      claimReward(undefined, {
        onSuccess: (rewardData) => {
          setRewardData(rewardData);
          setShowRewardModal(true);
          // 🎉 confetti 효과 추가
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }, // 화면 중간쯤에서 터짐
          });
        },
        onError: (error) => {
          // 에러 토스트는 useClaimReward 훅에서 처리됨
        },
      });
    }
  };

  // ==========================================
  // 🎯 미션 시스템
  // ==========================================

  // 미션별 오늘 완료 여부 (서버에서 확인)
  const missionTypes: ActivityType[] = [
    "attendance",
    "emotion",
    "quiz",
    "lastleaf",
    "register",
    "survey",
  ];
  const missionQueries = missionTypes.map((type) => useCheckTodayActivity(type, { staleTime: 0 }));
  const missionCompletedMap = Object.fromEntries(
    missionTypes.map((type, idx) => [type, missionQueries[idx].data])
  ) as Partial<Record<ActivityType, boolean>>;

  // 미션 시트가 열릴 때마다 refetch
  useEffect(() => {
    if (showMissions) {
      missionQueries.forEach((q) => q.refetch && q.refetch());
    }
  }, [showMissions]);

  /**
   * 미션 클릭 핸들러
   * 미션 타입에 따라 적절한 모달을 열거나 포인트를 적립
   */
  const handleMissionClick = (activityType: ActivityType) => {
    if (missionCompletedMap[activityType]) {
      toast("내일 다시");
      setShowMissions(false);
      return;
    }

    switch (activityType) {
      case "attendance":
        addPoint({ activityType });
        toast.success("출석 완료! 경험치가 적립되었습니다. ✏️");
        setShowMissions(false);
        break;
      case "quiz":
        setShowMissions(false);
        setShowQuizPage(true);
        break;
      case "lastleaf":
        setShowMissions(false);
        setShowCardMatchingGame(true);
        break;
      case "emotion":
        setShowMissions(false);
        setShowMessageCardCreator(true);
        break;
      case "register":
        setShowMissions(false);
        setShowInviteCodeModal(true);
        break;
      case "survey":
        setShowMissions(false);
        router.push("/survey?mission=true");
        break;
      default:
        addPoint({ activityType });
        setShowMissions(false);
    }
  };

  // ==========================================
  // 🎮 게임 콜백 함수들
  // ==========================================

  // 메시지 카드 생성 완료 핸들러
  const handleMessageCardCreated = () => {
    addPoint({ activityType: "emotion" });
  };

  // 카드 게임 완료 핸들러
  const handleCardGameCompleted = () => {
    addPoint({ activityType: "lastleaf" });
    toast.success("카드 맞히기 완료! 경험치가 적립되었습니다. 🍃");
  };

  // 카카오톡 공유 핸들러
  const handleShareKakao = () => {
    if (!family?.family?.inviteCode || !family?.family?.name) {
      toast.error("가족 정보를 불러올 수 없습니다.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const imageUrl = `${baseUrl}/images/modi-logo-small.png`;

    console.log("🔍 카카오 공유 시도:", {
      windowKakao: !!window.Kakao,
      isInitialized: window.Kakao?.isInitialized?.(),
      familyName: family.family.name,
      inviteCode: family.family.inviteCode,
      imageUrl,
    });

    // 카카오톡 공유만 사용하고 브라우저 공유 기능은 제거
    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log("✅ 카카오 SDK 초기화됨, 공유 실행");
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: `🌱 ${family.family.name} 가족 스페이스에 초대합니다!`,
          description: `함께 식물을 키우고 요금제도 절약해요!\n초대 코드: ${family.family.inviteCode}`,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: "https://modi.app",
            webUrl: "https://modi.app",
          },
        },
        buttons: [
          {
            title: "MODi에서 확인",
            link: {
              mobileWebUrl: "https://modi.app",
              webUrl: "https://modi.app",
            },
          },
        ],
      });

      // 공유 성공 후 포인트 적립
      addPoint({ activityType: "register" });
      toast.success("가족을 초대합니다! 경험치가 적립되었습니다. 👨‍👩‍👧‍👦");
    } else {
      console.log("❌ 카카오 SDK 초기화 안됨, 클립보드 복사로 대체");
      // 카카오톡 SDK가 없는 경우 클립보드에 복사
      const shareText = `🌱 ${family.family.name} 가족 스페이스에 초대합니다!\n\n초대 코드: ${family.family.inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi: https://modi.app`;
      navigator.clipboard.writeText(shareText);
      toast.success("공유 메시지가 복사되었습니다! 카카오톡에서 붙여넣기 해주세요.");

      // 복사 성공 후 포인트 적립
      addPoint({ activityType: "register" });
    }
  };

  // 초대 코드 복사 핸들러
  const handleCopyCode = async () => {
    if (!family?.family?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(family.family.inviteCode);
      setCopied(true);
      toast.success("초대 코드가 복사되었습니다! 가족들에게 공유해보세요.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다");
    }
  };

  // 새로운 초대 코드 생성 핸들러
  const handleGenerateNewInviteCode = () => {
    if (!familyId) return;
    generateNewCode(familyId);
  };

  // 가족명 저장 핸들러
  const handleSaveFamilyName = (name: string) => {
    if (!familyId) {
      toast.error("가족 ID를 찾을 수 없습니다.");
      return;
    }

    updateFamilyName(
      { fid: familyId, name },
      {
        onSuccess: () => {
          toast.success(`가족명이 변경되었습니다! ✨ 새로운 가족명: ${name}`);
        },
        onError: (error) => {
          toast.error("가족명 변경에 실패했습니다");
        },
      }
    );
  };

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
  // 🔄 라우터 및 기타
  // ==========================================
  const router = useRouter();

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
        <div className="flex-shrink-0 mb-4">
          <FamilyWateringStatus members={transformedMembers} />
        </div>
      )}

      {/* 🎯 미션하기 버튼 */}
      {currentLevel !== 5 && (
        <div className="flex justify-end mb-2 flex-shrink-0 mr-8">
          <Button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-6 py-2 text-sm"
            onClick={() => setShowMissions(true)}
          >
            미션하기
          </Button>
        </div>
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
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold text-green-600">5레벨 달성!!!</div>
            <ClaimRewardButton
              onClick={handleClaimRewardClick}
              disabled={isClaiming}
              isLoading={isClaiming}
            />
          </div>
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
          <MissionSheet
            missions={MISSIONS}
            onClose={() => setShowMissions(false)}
            onMissionClick={handleMissionClick}
            completedMap={missionCompletedMap}
          />
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

      {/* 🎲 카드 매칭 게임 */}
      <CardMatchingGame
        isOpen={showCardMatchingGame}
        onClose={() => setShowCardMatchingGame(false)}
        onComplete={handleCardGameCompleted}
      />

      {/* 💌 메시지 카드 생성기 */}
      <MessageCardCreator
        isOpen={showMessageCardCreator}
        onOpenChange={setShowMessageCardCreator}
        onCardCreated={handleMessageCardCreated}
        trigger={null}
      />

      {/* 👨‍👩‍👧‍👦 초대 코드 모달 */}
      <InviteCodeModal
        isOpen={showInviteCodeModal}
        onOpenChange={setShowInviteCodeModal}
        inviteCode={family?.family?.inviteCode || ""}
        familyName={family?.family?.name || "우리 가족"}
        onGenerateCode={handleGenerateNewInviteCode}
        onCopyCode={handleCopyCode}
        onShareKakao={handleShareKakao}
        onSaveFamilyName={handleSaveFamilyName}
        copied={copied}
        trigger={null}
      />

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
    </div>
  );
}
