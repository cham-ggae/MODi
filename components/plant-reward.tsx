"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import { Gift, Check } from "lucide-react"
import { useState } from "react"

export function PlantReward() {
  const { isDarkMode } = useTheme()
  const { plantState, rewards, claimReward, resetPlant } = usePlant()
  const [showConfetti, setShowConfetti] = useState(false)

  if (!plantState?.isCompleted) return null

  const handleClaimReward = () => {
    claimReward()
    setShowConfetti(true)

    // 3초 후에 컨페티 효과 제거
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  const handleNewPlant = () => {
    resetPlant()
  }

  const anyRewardClaimed = rewards.some((reward) => reward.claimed)

  return (
    <Card className={`border-2 border-yellow-500 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white">
        <CardTitle className="flex items-center text-center justify-center">
          <Gift className="w-5 h-5 mr-2" />
          식물 성장 완료! 보상을 받으세요
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{plantState.type === "flower" ? "🌸" : "🌳"}</div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
            축하합니다! {plantState.type === "flower" ? "꽃" : "나무"}이 완성되었어요
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
            가족과 함께 키운 {plantState.completedCount + 1}번째 식물이에요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              className={`p-4 rounded-lg border ${
                reward.claimed
                  ? isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                  : isDarkMode
                    ? "bg-yellow-900/30 border-yellow-700"
                    : "bg-yellow-50 border-yellow-300"
              }`}
              whileHover={{ scale: reward.claimed ? 1 : 1.03 }}
            >
              <div className="text-3xl mb-3">{reward.icon}</div>
              <h4 className={`font-medium mb-1 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>{reward.name}</h4>
              <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70 mb-2`}>
                {reward.description}
              </p>
              {reward.claimed && (
                <div className="flex items-center text-xs text-gray-500">
                  <Check className="w-3 h-3 mr-1" /> 수령 완료
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {!anyRewardClaimed && (
            <Button onClick={handleClaimReward} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Gift className="w-4 h-4 mr-2" />
              보상 받기
            </Button>
          )}

          <Button
            onClick={handleNewPlant}
            variant="outline"
            className={`border-[#81C784] text-[#388E3C] ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-[#F1F8E9]"}`}
          >
            새로운 식물 키우기
          </Button>
        </div>
      </CardContent>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: `${Math.random() * 20}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  "#FF5252",
                  "#FF4081",
                  "#E040FB",
                  "#7C4DFF",
                  "#536DFE",
                  "#448AFF",
                  "#40C4FF",
                  "#18FFFF",
                  "#64FFDA",
                  "#69F0AE",
                  "#B2FF59",
                  "#EEFF41",
                  "#FFFF00",
                  "#FFD740",
                  "#FFAB40",
                  "#FF6E40",
                ][Math.floor(Math.random() * 16)],
              }}
              initial={{ y: -20, scale: 0 }}
              animate={{
                y: window.innerHeight,
                scale: [0, 1, 1, 0.5, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
