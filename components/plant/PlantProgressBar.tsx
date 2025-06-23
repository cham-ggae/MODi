import { motion } from "framer-motion";

interface ProgressProps {
  level: number;
  progress: number;
}

//현재 경험치 기반의 레벨업 진행 바

export const PlantProgressBar = ({ level, progress }: ProgressProps) => (
  <div className="px-6 mb-6">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-900">레벨 {level + 1} 더보기</span>
      <span className="text-sm font-bold text-blue-500">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="bg-green-400 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  </div>
);
