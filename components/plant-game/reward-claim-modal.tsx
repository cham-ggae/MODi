"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Gift, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"
import { useFamilySpace } from "@/contexts/family-space-context"

interface RewardItem {
  id: string
  name: string
  description: string
  icon: string
}

interface RewardClaimModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RewardClaimModal({ isOpen, onClose }: RewardClaimModalProps) {
  const { isDarkMode } = useTheme()
  const { plantState, claimReward } = usePlant()
  const { addMessageCard } = useFamilySpace()
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 보상 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    if (isOpen && plantState?.level === 5) {
      setIsLoading(true)
      // 모의 API 호출
      setTimeout(() => {
        setRewards([
          {
            id: "1",
            name: "OTT 한달 무료 이용권",
            description: "넷플릭스, 왓챠, 티빙 중 선택 가능한 1개월 무료 이용권",
            icon: "🎬",
          },
          {
            id: "2",
            name: "가족 결합 할인권",
            description: "다음 달 가족 결합 요금제 10% 추가 할인",
            icon: "💰",
          },
          {
            id: "3",
            name: "베라 패밀리 사이즈",
            description: "배스킨라빈스 패밀리 사이즈 아이스크림 교환권",
            icon: "🍦",
          },
          {
            id: "4",
            name: "로밍 할인 쿠폰",
            description: "해외 로밍 50% 할인 쿠폰",
            icon: "✈️",
          },
        ])
        setIsLoading(false)
      }, 1000)
    }
  }, [isOpen, plantState])

  const handleClaimReward = async () => {
    setIsLoading(true)

    try {
      // 실제로는 API 호출: POST /plants/claim-reward
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 보상 수령 처리
      claimReward()
      setIsClaimed(true)
      setShowConfetti(true)

      // 가족 스페이스에 보상 내역 추가
      addMessageCard({
        sender: "MODi 시스템",
        message: `🎉 식물 키우기 완료 보상을 받았습니다!\n\n${rewards.map((r) => `${r.icon} ${r.name}`).join("\n")}`,
        design: "star",
        timestamp: new Date(),
      })

      // 3초 후에 컨페티 효과 제거
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
    } catch (error) {
      console.error("보상 수령 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsClaimed(false)
    setShowConfetti(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={handleClose} />

      {/* Modal Content */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg">
        <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className={`text-center text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
              🎉 보상 받기
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>

          <div className="space-y-6 px-6 pb-6">
            {/* 축하 메시지 */}
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🌟
              </motion.div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>축하합니다!</h3>
              <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
                가족과 함께 식물을 성공적으로 키웠습니다!
              </p>
            </div>

            {/* 로딩 상태 */}
            {isLoading && !isClaimed && (
              <div className="text-center py-8">
                <motion.div
                  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>보상을 준비하고 있습니다...</p>
              </div>
            )}

            {/* 보상 목록 */}
            {!isLoading && rewards.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    className={`p-4 rounded-lg border ${
                      isClaimed
                        ? isDarkMode
                          ? "bg-green-900/30 border-green-700"
                          : "bg-green-100 border-green-300"
                        : isDarkMode
                          ? "bg-yellow-900/30 border-yellow-700"
                          : "bg-yellow-50 border-yellow-300"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="text-3xl mb-3 text-center">{reward.icon}</div>
                    <h4 className={`font-medium mb-1 text-center ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
                      {reward.name}
                    </h4>
                    <p className={`text-xs text-center ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70`}>
                      {reward.description}
                    </p>
                    {isClaimed && (
                      <div className="flex items-center justify-center mt-2 text-green-500">
                        <Check className="w-4 h-4 mr-1" />
                        <span className="text-xs">수령 완료</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex justify-center">
              {!isClaimed ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleClaimReward}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    ) : (
                      <Gift className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "처리 중..." : "보상 받기"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button onClick={handleClose} className="bg-[#81C784] hover:bg-[#388E3C] text-white px-8 py-3">
                    확인
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      <AnimatePresence>
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
                exit={{ opacity: 0 }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
