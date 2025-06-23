import { Sparkles, Droplets, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onWater: () => void;
  onFeed: () => void;
  disabled?: boolean;
  checkingWater?: boolean;
  alreadyWatered?: boolean;
  checkingFeed?: boolean;
  alreadyFed?: boolean;
}

export function PlantActionButtons({
  onWater,
  onFeed,
  disabled = false,
  checkingWater = false,
  alreadyWatered = false,
  checkingFeed = false,
  alreadyFed = false,
}: Props) {
  return (
    <div className="px-6 mb-4 ">
      <div className="grid grid-cols-2 gap-4 ">
        <motion.div
          whileHover={checkingFeed || alreadyFed || disabled ? undefined : { scale: 1.05 }}
          whileTap={checkingFeed || alreadyFed || disabled ? undefined : { scale: 0.95 }}
          className={`bg-white rounded-2xl  p-4 text-center shadow-sm cursor-pointer ${
            checkingFeed || alreadyFed || disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={checkingFeed || alreadyFed || disabled ? undefined : onFeed}
        >
          <div className="flex justify-center items-center mb-2">
            {!alreadyFed && <Sparkles className="w-6 h-6 text-purple-500" />}
            {alreadyFed && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            {checkingFeed ? "확인 중" : alreadyFed ? "영양제 주기 완료!" : "영양제 주기"}
          </div>
        </motion.div>
        <motion.div
          whileHover={checkingWater || alreadyWatered || disabled ? undefined : { scale: 1.05 }}
          whileTap={checkingWater || alreadyWatered || disabled ? undefined : { scale: 0.95 }}
          className={`bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer ${
            checkingWater || alreadyWatered || disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={checkingWater || alreadyWatered || disabled ? undefined : onWater}
        >
          <div className="flex justify-center items-center mb-2">
            {!alreadyWatered && <Droplets className="w-6 h-6 text-blue-500" />}
            {alreadyWatered && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            {checkingWater ? "확인 중" : alreadyWatered ? "오늘 물주기 완료!" : "물 주기"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
