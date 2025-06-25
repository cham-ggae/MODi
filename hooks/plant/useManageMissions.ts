import { useEffect, useCallback } from "react";
import { useCheckTodayActivity, useAddPoint } from "@/hooks/plant";
import { ActivityType } from "@/types/plants.type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useManageMissions({
  showMissions,
  setShowMissions,
  setShowQuizPage,
  setShowCardMatchingGame,
  setShowMessageCardCreator,
  setShowInviteCodeModal,
}: {
  showMissions: boolean;
  setShowMissions: (v: boolean) => void;
  setShowQuizPage: (v: boolean) => void;
  setShowCardMatchingGame: (v: boolean) => void;
  setShowMessageCardCreator: (v: boolean) => void;
  setShowInviteCodeModal: (v: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: addPoint } = useAddPoint();

  // 미션 타입 정의
  const missionTypes: ActivityType[] = [
    "attendance",
    "emotion",
    "quiz",
    "lastleaf",
    "register",
    "survey",
  ];

  // 미션별 오늘 완료 여부 (서버에서 확인)
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
  const handleMissionClick = useCallback((activityType: ActivityType) => {
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
  }, [missionCompletedMap, addPoint, setShowMissions, setShowQuizPage, setShowCardMatchingGame, setShowMessageCardCreator, setShowInviteCodeModal, router]);

  return {
    missionTypes,
    missionQueries,
    missionCompletedMap,
    handleMissionClick,
  };
}
