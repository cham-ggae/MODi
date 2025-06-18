"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Droplets } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function PlantGamePage() {
  const [selectedPlantType, setSelectedPlantType] = useState<"flower" | "tree" | null>(null)
  const [showMissions, setShowMissions] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentProgress, setCurrentProgress] = useState(26)
  const [isWatering, setIsWatering] = useState(false)
  const [isFeeding, setIsFeeding] = useState(false)

  useEffect(() => {
    // localStorage에서 선택된 식물 타입과 레벨 정보 가져오기
    const plantType = localStorage.getItem("selectedPlantType") as "flower" | "tree" | null
    const level = Number.parseInt(localStorage.getItem("plantLevel") || "1")
    const progress = Number.parseInt(localStorage.getItem("plantProgress") || "26")

    setSelectedPlantType(plantType)
    setCurrentLevel(level)
    setCurrentProgress(progress)
  }, [])

  const familyWateringStatus = [
    { id: 1, name: "엄마", avatar: "🖼️", hasWatered: true, status: "물주기 완료" },
    { id: 2, name: "아빠", avatar: "👤", hasWatered: false, status: "" },
    { id: 3, name: "나", avatar: "👤", hasWatered: true, status: "물주기 완료" },
  ]

  const missions = [
    {
      id: 1,
      title: "더 받을 수 있는 영양제 2개",
      description: "미션 매일 밤 12시에 다시 시작됩니다.",
      icon: "✏️",
      reward: "영양제 1개",
    },
    {
      id: 2,
      title: "매일 응답받기",
      description: "미션 참여하고 좋은 반응요",
      icon: "🏆",
      reward: "영양제 1개",
    },
    {
      id: 3,
      title: "신용카드 캐시백",
      description: "아빠만 최대 77.9만원",
      icon: "💳",
      reward: "영양제 1개",
    },
  ]

  // 현재 레벨에 따른 식물 이미지 가져오기
  const getCurrentPlantImage = () => {
    if (!selectedPlantType) return null

    const level = Math.min(Math.max(currentLevel, 1), 5) // 1-5 범위로 제한
    return `/images/${selectedPlantType}${level}.png`
  }

  const handleWatering = () => {
    setIsWatering(true)
    setTimeout(() => setIsWatering(false), 2000)
  }

  const handleFeeding = () => {
    setIsFeeding(true)
    setTimeout(() => setIsFeeding(false), 2000)
  }

  const plantImage = getCurrentPlantImage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <Link href="/family-space">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">새싹 키우기</h1>
        <Button
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-4 py-2 text-sm"
          onClick={() => setShowMissions(true)}
        >
          미션하기
        </Button>
      </div>

      {/* Family Status */}
      <div className="px-6 mb-6 relative z-10">
        <div className="flex justify-center space-x-8 mb-8">
          {familyWateringStatus.map((member) => (
            <div key={member.id} className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  member.hasWatered ? "bg-blue-100 border-2 border-blue-400" : "bg-gray-100"
                }`}
              >
                <div className="text-2xl">{member.avatar}</div>
              </div>
              <div className="text-sm font-medium text-gray-900">{member.name}</div>
              {member.hasWatered && <div className="text-xs text-blue-500">{member.status}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Plant Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        {plantImage ? (
          <motion.div
            key={currentLevel} // 레벨 변경 시 애니메이션 재시작
            animate={{
              rotate: [0, 5, -5, 0],
              scale: isWatering || isFeeding ? [1, 1.1, 1] : 1,
            }}
            transition={{
              rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              scale: { duration: 0.5 },
            }}
            className="flex justify-center"
          >
            <Image
              src={plantImage || "/placeholder.svg"}
              alt={`${selectedPlantType} 레벨 ${currentLevel}`}
              width={300}
              height={300}
              className="object-contain"
            />
          </motion.div>
        ) : (
          <div className="text-8xl">🌱</div>
        )}

        {/* Water Animation */}
        <AnimatePresence>
          {isWatering && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 50 }}
              exit={{ opacity: 0 }}
              className="absolute text-4xl"
            >
              💧💧💧
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed Animation */}
        <AnimatePresence>
          {isFeeding && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute text-4xl"
            >
              ✨⭐✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        {/* Progress */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">레벨 {currentLevel + 1} 더보기</span>
            <span className="text-sm font-bold text-blue-500">{currentProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer"
              onClick={handleFeeding}
            >
              <div className="flex justify-center mb-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">영양제 주기</div>
              <div className="text-xs text-gray-500">1개 보유</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer"
              onClick={handleWatering}
            >
              <div className="flex justify-center mb-2">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">물 주기</div>
              <div className="text-xs text-gray-500">5시간 59분 후</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Bottom Sheet */}
      <AnimatePresence>
        {showMissions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowMissions(false)}
            />

            {/* Mission Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {/* Mission Content */}
              <div className="px-6 pb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">미션하고 영양제 더 받기</h2>

                <div className="space-y-4">
                  {missions.map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                          {mission.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{mission.title}</div>
                          <div className="text-xs text-gray-500">{mission.description}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-3 py-1 text-xs"
                      >
                        {mission.reward}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
