import { Sparkles, Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface ActionsProps {
  onWater: () => void;
  onFeed: () => void;
  waterCooldownText: string;
  nutrientCount: number;
}
//영양제/물주기 버튼 구성 (아이콘 포함)
export const PlantActions = ({
  onWater,
  onFeed,
  waterCooldownText,
  nutrientCount,
}: ActionsProps) => (
  <div className="px-6 mb-8">
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer"
        onClick={onFeed}
      >
        <div className="flex justify-center mb-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">영양제 주기</div>
        <div className="text-xs text-gray-500">{nutrientCount}개 보유</div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer"
        onClick={onWater}
      >
        <div className="flex justify-center mb-2">
          <Droplets className="w-6 h-6 text-blue-500" />
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">물 주기</div>
        <div className="text-xs text-gray-500">{waterCooldownText}</div>
      </motion.div>
    </div>
  </div>
);
