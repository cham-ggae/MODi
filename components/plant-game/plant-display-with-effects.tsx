"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"
import Lottie from "lottie-react"
import wateringAnimation from "../../public/animations/watering.json"

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
  const [wateringData, setWateringData] = useState<any>(null)

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

  useEffect(() => {
    if (showWaterEffect || showNutrientEffect) {
      setIsGrowing(true)
      console.log('Effect triggered:', { showWaterEffect, showNutrientEffect });
    }
  }, [showWaterEffect, showNutrientEffect])

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        console.log('Fetching animation data...')
        const response = await fetch('/animations/watering.json')
        console.log('Response:', response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Animation data loaded:', data)
        setWateringData(data)
      } catch (error) {
        console.error('Error loading animation:', error)
      }
    }

    loadAnimation()
  }, [])

  useEffect(() => {
    console.log('showWaterEffect:', showWaterEffect)
    console.log('wateringData:', wateringData)
  }, [showWaterEffect, wateringData])

  useEffect(() => {
    console.log('wateringAnimation loaded:', wateringAnimation)
    console.log('showWaterEffect changed:', showWaterEffect)
  }, [showWaterEffect])

  if (!plantState) return null

  const plantStages = getPlantStages(plantState.type)
  const currentStage = plantStages[plantState.level - 1] || plantStages[0]
  const progressPercentage = getProgressPercentage()

  console.log('Rendering plant display with effects:', { showWaterEffect, wateringAnimation });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        {currentStage.image && (
          <motion.div
            animate={isGrowing ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1 }}
          >
            <Image
              src={currentStage.image}
              alt={currentStage.name}
              width={200}
              height={200}
              className="object-contain"
            />
          </motion.div>
        )}

        {/* Water Effect */}
        {showWaterEffect && wateringAnimation && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '0%',
              left: '0%',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lottie
              animationData={wateringAnimation}
              loop={false}
              autoplay={true}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '250px',
                maxHeight: '250px',
              }}
              onComplete={() => {
                console.log('Animation completed');
                setIsGrowing(false);
              }}
              onDOMLoaded={() => {
                console.log('Lottie DOM loaded');
              }}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
            />
          </div>
        )}

        {/* Nutrient Effect */}
        {showNutrientEffect && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-full blur-xl" />
          </motion.div>
        )}
      </div>

      {/* Stage Info */}
      <motion.h2
        className="text-2xl font-bold text-[#388E3C] mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentStage.name} (Lv.{plantState.level})
      </motion.h2>

      <motion.p
        className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} mb-6`}
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
