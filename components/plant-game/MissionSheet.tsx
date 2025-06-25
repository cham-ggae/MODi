import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ActivityType } from "@/types/plants.type";
import { usePlantGameStore } from '@/store/usePlantGameStore';
import { MISSIONS } from '@/data/missions';

interface Props {
  onMissionClick: (activityType: ActivityType) => void;
  completedMap: Partial<Record<ActivityType, boolean>>;
}

export function MissionSheet({ onMissionClick, completedMap }: Props) {
  const setShowMissions = usePlantGameStore((s) => s.setShowMissions);
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
              const completed = completedMap[m.activityType];
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
                      onClick={() => onMissionClick(m.activityType)}
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
