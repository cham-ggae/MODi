"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Droplets, Sparkles, Gift } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"

interface UpdatedPlantActionsProps {
  onWaterPlant: () => void
  onUseNutrient: () => void
  onClaimReward?: () => void
}

export function UpdatedPlantActions({ onWaterPlant, onUseNutrient, onClaimReward }: UpdatedPlantActionsProps) {
  const { isDarkMode } = useTheme()
  const { plantState, familyWatering, getRemainingExp } = usePlant()
  const [isWatering, setIsWatering] = useState(false)
  const [isUsingNutrient, setIsUsingNutrient] = useState(false)

  if (!plantState) return null

  const currentUserWatered = familyWatering.find((member) => member.memberId === "3")?.hasWatered || false
  const remainingExp = getRemainingExp()

  const handleWaterClick = () => {
    if (currentUserWatered || plantState.isCompleted) return

    setIsWatering(true)
    onWaterPlant()

    setTimeout(() => {
      setIsWatering(false)
    }, 2000)
  }

  const handleNutrientClick = () => {
    if (plantState.nutrientCount <= 0 || plantState.isCompleted) return

    setIsUsingNutrient(true)
    onUseNutrient()

    setTimeout(() => {
      setIsUsingNutrient(false)
    }, 1500)
  }

  // 식물이 완성된 경우 보상 받기 버튼 표시
  if (plantState.isCompleted) {
    return (
      <div className="mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <div className="text-6xl mb-2">{plantState.type === "flower" ? "🌸" : "🌳"}</div>
          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
            축하합니다! {plantState.type === "flower" ? "꽃" : "나무"}이 완성되었어요!
          </h3>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onClaimReward}
            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
          >
            <Gift className="w-6 h-6 mr-3" />
            보상 받기
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* 다음 레벨까지 남은 경험치 표시 */}
      <div className="text-center mb-4">
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
          다음 레벨까지 <span className="font-bold text-[#388E3C]">{remainingExp}점</span> 남았어요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 물주기 버튼 */}
        <motion.div
          whileHover={{ scale: currentUserWatered ? 1 : 1.02 }}
          whileTap={{ scale: currentUserWatered ? 1 : 0.98 }}
        >
          <Button
            onClick={handleWaterClick}
            disabled={currentUserWatered}
            className={`h-16 text-lg font-semibold w-full ${
              currentUserWatered
                ? "bg-green-500 hover:bg-green-500 cursor-not-allowed"
                : isWatering
                  ? "bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            <motion.div
              className="flex items-center"
              animate={isWatering ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: isWatering ? 3 : 0 }}
            >
              <Droplets className="w-6 h-6 mr-3" />
              {currentUserWatered ? "물 줌" : "물 주기"}
            </motion.div>
          </Button>
        </motion.div>

        {/* 영양제 버튼 */}
        <motion.div whileHover={{ scale: plantState.nutrientCount <= 0 ? 1 : 1.02 }}>
          <Button
            onClick={handleNutrientClick}
            disabled={plantState.nutrientCount <= 0}
            className={`w-full h-16 text-lg font-semibold ${
              plantState.nutrientCount <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : isUsingNutrient
                  ? "bg-purple-600"
                  : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            <motion.div
              className="flex items-center"
              animate={isUsingNutrient ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3, repeat: isUsingNutrient ? 2 : 0 }}
            >
              <Sparkles className="w-6 h-6 mr-3" />
              영양제 주기
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
