"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Sparkles, ArrowLeft, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"
import { PlantDisplayWithEffects } from "@/components/plant-game/plant-display-with-effects"
import { FamilyWateringSection } from "@/components/plant-game/family-watering-section"
import type { WaterEventData } from "@/types/water-event"
import Link from "next/link"

interface ModernPlantPageProps {
  onWaterPlant: () => void
  onUseNutrient: () => void
  waterEvents: WaterEventData[]
  showWaterEffect: boolean
  showNutrientEffect: boolean
}

export function ModernPlantPage({
  onWaterPlant,
  onUseNutrient,
  waterEvents,
  showWaterEffect,
  showNutrientEffect,
}: ModernPlantPageProps) {
  const { isDarkMode } = useTheme()
  const { plantState, getRemainingExp } = usePlant()
  const [showMissions, setShowMissions] = useState(false)

  if (!plantState) return null

  const remainingExp = getRemainingExp()
  const currentUserWatered = waterEvents.find((event) => event.uid === 3)?.hasWatered || false

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="relative p-4 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">
              {plantState.isCompleted ? "키우기 완료!" : "오늘 물주기 완료!"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {plantState.isCompleted ? "축하합니다! 🎉" : "좀 더 자라날까 같이요"}
            </p>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-500 text-white text-xs">🧪 {plantState.nutrientCount}</Badge>
          <Button variant="ghost" size="sm" onClick={() => setShowMissions(!showMissions)}>
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Plant Area */}
      <div className="px-4 pb-4">
        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Plant Display Circle */}
          <div className="relative h-80 flex items-center justify-center">
            <motion.div
              className="w-64 h-64 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-green-200 rounded-full" />
              </div>

              {/* Plant */}
              <div className="relative z-10">
                <PlantDisplayWithEffects showWaterEffect={showWaterEffect} showNutrientEffect={showNutrientEffect} />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-8 right-8 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              ⭐ 팝업초로 레벨업! ⭐
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-2 px-2">
                <span>레벨 {plantState.level}일차</span>
                <span>{Math.round((plantState.currentExp / plantState.requiredExp) * 100)}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(plantState.currentExp / plantState.requiredExp) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onWaterPlant}
              disabled={currentUserWatered}
              className={`w-full h-16 rounded-2xl font-semibold text-lg ${
                currentUserWatered
                  ? "bg-green-500 hover:bg-green-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white shadow-lg`}
            >
              <div className="flex flex-col items-center">
                <Droplets className="w-6 h-6 mb-1" />
                <span className="text-sm">{currentUserWatered ? "물 줌" : "물 주기"}</span>
                <span className="text-xs opacity-80">3개 미션</span>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onUseNutrient}
              disabled={plantState.nutrientCount <= 0}
              className={`w-full h-16 rounded-2xl font-semibold text-lg ${
                plantState.nutrientCount <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
              } text-white shadow-lg`}
            >
              <div className="flex flex-col items-center">
                <Sparkles className="w-6 h-6 mb-1" />
                <span className="text-sm">영양제 주기</span>
                <span className="text-xs opacity-80">네잎 만들기</span>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Family Watering Status */}
        <div className="mt-6">
          <FamilyWateringSection waterEvents={waterEvents} />
        </div>
      </div>

      {/* Missions Slide Up Panel */}
      <AnimatePresence>
        {showMissions && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">미션하고 영양제 더 받기</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMissions(false)} className="text-gray-500">
                  ✕
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Mission Items */}
                {[
                  {
                    icon: "🧪",
                    title: "더 빨을 수 있는 영양제 5개",
                    subtitle: "미션을 완료할 12시에 다시 시작됩니다.",
                    action: "영양제 1개",
                  },
                  {
                    icon: "💎",
                    title: "예적금 상품 보러가기",
                    subtitle: "추천한 간편한 절차예요",
                    action: "영양제 1개",
                  },
                  {
                    icon: "🎁",
                    title: "혜택 구경하기",
                    subtitle: "선택한 오늘의 혜택",
                    action: "영양제 1개",
                  },
                  {
                    icon: "💰",
                    title: "내 대출 한도 조회",
                    subtitle: "한눈에 상품별 한도 조회",
                    action: "영양제 3개",
                  },
                ].map((mission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center text-xl">
                        {mission.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{mission.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mission.subtitle}</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4">
                      {mission.action}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for missions */}
      {showMissions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowMissions(false)}
        />
      )}
    </div>
  )
}
