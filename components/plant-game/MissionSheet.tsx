import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePlantGameStore } from '@/store/usePlantGameStore';
import { MISSIONS } from '@/data/missions';
import { toast } from 'sonner';
import { useCheckTodayActivity } from '@/hooks/plant';

export function MissionSheet() {
  const setShowMissions = usePlantGameStore((s) => s.setShowMissions);
  const setShowQuizPage = usePlantGameStore((s) => s.setShowQuizPage);
  const setShowCardMatchingGame = usePlantGameStore((s) => s.setShowCardMatchingGame);
  const setShowMessageCardCreator = usePlantGameStore((s) => s.setShowMessageCardCreator);
  const setShowInviteCodeModal = usePlantGameStore((s) => s.setShowInviteCodeModal);

  // 미션별 오늘 완료 여부 (직접 훅 사용)
  const missionTypes = MISSIONS.map(m => m.activityType);
  const missionQueries = missionTypes.map((type) => useCheckTodayActivity(type, { staleTime: 0 }));
  const missionCompletedMap = Object.fromEntries(
    missionTypes.map((type, idx) => [type, !!missionQueries[idx].data])
  );

  // 미션 클릭 핸들러 (zustand setter 직접 사용)
  const handleMissionClick = (activityType: string) => {
    if (missionCompletedMap && missionCompletedMap[activityType]) {
      toast("내일 다시");
      setShowMissions(false);
      return;
    }
    switch (activityType) {
      case "attendance":
        toast.success("출석 완료! 경험치가 적립되었습니다. ✏️");
        break;
      case "quiz":
        setShowQuizPage(true);
        setTimeout(() => {
          console.log("[디버그] showQuizPage:", usePlantGameStore.getState().showQuizPage);
        }, 0);
        break;
      case "lastleaf":
        setShowCardMatchingGame(true);
        setTimeout(() => {
          console.log("[디버그] showCardMatchingGame:", usePlantGameStore.getState().showCardMatchingGame);
        }, 0);
        break;
      case "emotion":
        setShowMessageCardCreator(true);
        setTimeout(() => {
          console.log("[디버그] showMessageCardCreator:", usePlantGameStore.getState().showMessageCardCreator);
        }, 0);
        break;
      case "register":
        setShowInviteCodeModal(true);
        setTimeout(() => {
          console.log("[디버그] showInviteCodeModal:", usePlantGameStore.getState().showInviteCodeModal);
        }, 0);
        break;
      case "survey":
        window.location.href = "/survey?mission=true";
        break;
      default:
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setShowMissions(false)}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto"
      >
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        <div className="px-6 pb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            미션하고 다양한 혜택 챙겨가요!
          </h2>
          <div className="space-y-4">
            {MISSIONS.map((m) => {
              const completed = missionCompletedMap && missionCompletedMap[m.activityType];
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                      {m.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{m.title}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-3 py-1 text-xs"
                      onClick={() => handleMissionClick(m.activityType)}
                      disabled={completed}
                    >
                      {m.reward}
                    </Button>
                    {completed && <span className="text-xs text-gray-400 mt-1">내일 다시</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
