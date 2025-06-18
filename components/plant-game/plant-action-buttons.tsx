"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Droplets, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"

interface PlantActionButtonsProps {
  onWaterPlant: () => void
  onUseNutrient: () => void
}

export function PlantActionButtons({ onWaterPlant, onUseNutrient }: PlantActionButtonsProps) {
  const { isDarkMode } = useTheme()
  const { plantState, familyWatering } = usePlant()
  const [isWatering, setIsWatering] = useState(false)

  if (!plantState) return null

  const currentUserWatered = familyWatering.find((member) => member.memberId === "3")?.hasWatered || false

  const handleWaterClick = () => {
    if (currentUserWatered) return

    setIsWatering(true)
    onWaterPlant()

    setTimeout(() => {
      setIsWatering(false)
    }, 2000)
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
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
            {currentUserWatered ? (
              <>
                <Droplets className="w-6 h-6 mr-3 text-white" />
                물주기 완료 ✓
              </>
            ) : (
              <>
                <Droplets className="w-6 h-6 mr-3" />물 주기
              </>
            )}
          </motion.div>
        </Button>
      </motion.div>

      <div className="space-y-2">
        <motion.div whileHover={{ scale: plantState.nutrientCount <= 0 || plantState.nutrientActive ? 1 : 1.02 }}>
          <Button
            onClick={onUseNutrient}
            disabled={plantState.nutrientCount <= 0 || plantState.nutrientActive}
            className={`w-full h-12 text-lg font-semibold ${
              plantState.nutrientActive || plantState.nutrientCount <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white`}
          >
            <Zap className="w-5 h-5 mr-2" />
            {plantState.nutrientActive ? "영양제 효과 적용 중" : "영양제 사용하기"}
          </Button>
        </motion.div>
        <div className="text-xs text-center opacity-70">
          {plantState.nutrientActive ? (
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              오늘 하루 물주기 포인트 2배 효과 적용 중
            </motion.div>
          ) : (
            <span>영양제를 사용하면 오늘 물주기 포인트가 2배가 됩니다</span>
          )}
        </div>
      </div>
    </div>
  )
}
