"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"

interface PlantDisplayWithEffectsProps {
  showWaterEffect?: boolean
  showNutrientEffect?: boolean
}

interface PlantStage {
  id: number
  name: string
  image: string
  description: string
}

export function PlantDisplayWithEffects({
  showWaterEffect = false,
  showNutrientEffect = false,
}: PlantDisplayWithEffectsProps) {
  const { isDarkMode } = useTheme()
  const { plantState, getProgressPercentage } = usePlant()
  const [isGrowing, setIsGrowing] = useState(false)
  const [prevLevel, setPrevLevel] = useState(1)

  const getPlantStages = (type: "flower" | "tree"): PlantStage[] => {
    if (type === "flower") {
      return [
        {
          id: 1,
          name: "새싹",
          image: "/images/plant-stage-1.png",
          description: "작은 새싹이 돋아났어요",
        },
        {
          id: 2,
          name: "줄기",
          image: "/images/plant-stage-2.png",
          description: "줄기가 자라고 있어요",
        },
        {
          id: 3,
          name: "잎사귀",
          image: "/images/plant-stage-3.png",
          description: "잎사귀가 무성해졌어요",
        },
        {
          id: 4,
          name: "꽃봉오리",
          image: "/images/plant-stage-4.png",
          description: "꽃봉오리가 맺혔어요",
        },
        {
          id: 5,
          name: "꽃",
          image: "/images/flower-complete.png",
          description: "아름다운 꽃이 피었어요",
        },
      ]
    } else {
      return [
        {
          id: 1,
          name: "새싹",
          image: "/images/plant-stage-1.png",
          description: "작은 새싹이 돋아났어요",
        },
        {
          id: 2,
          name: "줄기",
          image: "/images/plant-stage-2.png",
          description: "줄기가 자라고 있어요",
        },
        {
          id: 3,
          name: "가지",
          image: "/images/plant-stage-3.png",
          description: "가지가 뻗어나가고 있어요",
        },
        {
          id: 4,
          name: "작은 나무",
          image: "/images/plant-stage-4.png",
          description: "작은 나무로 자라고 있어요",
        },
        {
          id: 5,
          name: "나무",
          image: "/images/tree-complete.png",
          description: "튼튼한 나무가 되었어요",
        },
      ]
    }
  }

  useEffect(() => {
    if (plantState && plantState.level !== prevLevel) {
      setIsGrowing(true)
      setPrevLevel(plantState.level)

      setTimeout(() => {
        setIsGrowing(false)
      }, 1000)
    }
  }, [plantState, prevLevel])

  if (!plantState) return null

  const plantStages = getPlantStages(plantState.type)
  const currentStage = plantStages[plantState.level - 1] || plantStages[0]
  const progressPercentage = getProgressPercentage()

  return (
    <div className="text-center">
      {/* Plant Image with Effects */}
      <div className="relative mb-6 h-64 flex items-center justify-center">
        <motion.div
          key={plantState.level}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{
            scale: isGrowing ? [1, 1.2, 1] : 1,
            opacity: 1,
            y: 0,
            rotate: isGrowing ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: isGrowing ? 1 : 0.5,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <Image
            src={currentStage.image || "/placeholder.svg"}
            alt={currentStage.name}
            width={200}
            height={200}
            className="object-contain"
          />

          {/* Growth Sparkles */}
          {isGrowing && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Water Effect */}
          {showWaterEffect && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`water-${i}`}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Water Droplet Emojis */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`water-emoji-${i}`}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    top: "10%",
                    left: `${30 + i * 10}%`,
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -50,
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                >
                  💧
                </motion.div>
              ))}
            </>
          )}

          {/* Nutrient Effect - 새싹 주변에만 */}
          {showNutrientEffect && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`nutrient-${i}`}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full pointer-events-none"
                  style={{
                    top: `${30 + Math.random() * 40}%`,
                    left: `${30 + Math.random() * 40}%`,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -30],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Sparkle Effect around plant */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-lg pointer-events-none"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* Stage Info */}
      <motion.h2
        className="text-2xl font-bold text-[#388E3C] mb-3"
        key={`title-${plantState.level}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentStage.name} (Lv.{plantState.level})
      </motion.h2>

      <motion.p
        className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} mb-6`}
        key={`desc-${plantState.level}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {currentStage.description}
      </motion.p>

      {/* Progress Info */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-[#388E3C] mb-3">
          <span>Lv.{plantState.level}</span>
          <span>{progressPercentage}%</span>
          {plantState.level < 5 && <span>Lv.{plantState.level + 1}</span>}
        </div>

        <div className={`w-full rounded-full h-4 overflow-hidden ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#81C784] to-[#388E3C]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  )
}
