"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Droplets, Wifi, WifiOff } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"
import { usePlantSocket } from "@/hooks/use-plant-socket"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useEffect, useState } from "react"
import { PointService } from "@/services/point-service"

interface WateringNotification {
  id: string
  memberName: string
  avatar: string
  timestamp: Date
}

export function RealTimeFamilyWatering() {
  const { isDarkMode } = useTheme()
  const { familyWatering, waterPlant } = usePlant()
  const { isConnected, waterEvents, sendMessage } = usePlantSocket("family-1") // 실제로는 현재 가족 ID 사용
  const [notifications, setNotifications] = useState<WateringNotification[]>([])

  const allWatered = familyWatering.every((member) => member.hasWatered)
  const wateredCount = familyWatering.filter((member) => member.hasWatered).length

  // WebSocket 이벤트 처리
  useEffect(() => {
    waterEvents.forEach((event) => {
      // 실시간으로 물주기 상태 업데이트
      waterPlant(event.uid, event.name, event.avatarUrl)

      // 알림 추가
      const notification: WateringNotification = {
        id: `${event.uid}-${event.timestamp}`,
        memberName: event.name,
        avatar: event.avatarUrl,
        timestamp: new Date(event.timestamp),
      }

      setNotifications((prev) => {
        if (prev.find((n) => n.id === notification.id)) return prev
        return [notification, ...prev.slice(0, 2)] // 최대 3개까지만 표시
      })

      // 3초 후 알림 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 3000)
    })
  }, [waterEvents, waterPlant])

  const handleWaterClick = (memberId: string, memberName: string, avatar: string) => {
    // 중복 체크
    if (PointService.checkActivityExists("water", memberId)) {
      return
    }

    // 물주기 실행
    waterPlant(memberId, memberName, avatar)

    // 활동 기록
    PointService.recordActivity("water", memberId)

    // WebSocket으로 실시간 전송
    sendMessage(memberId, memberName, avatar)
  }

  return (
    <div className="mb-6">
      {/* 연결 상태 표시 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>가족 물주기 현황</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isConnected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
            <span className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}>
              {isConnected ? "실시간" : "연결 중"}
            </span>
          </div>
          <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
            {wateredCount}/{familyWatering.length}명 완료
          </span>
          {allWatered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
      </div>

      {/* 실시간 알림 */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{notification.avatar}</span>
              <span className="font-medium">{notification.memberName}님이 물을 주었습니다!</span>
              <Droplets className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 가족 구성원 카드 */}
      <div className="grid grid-cols-3 gap-4">
        {familyWatering.map((member, index) => {
          const hasWateredToday = PointService.checkActivityExists("water", member.memberId)
          const canWater = !hasWateredToday && !member.hasWatered

          return (
            <motion.div
              key={member.memberId}
              className={`p-4 rounded-lg text-center border-2 transition-all cursor-pointer ${
                member.hasWatered
                  ? isDarkMode
                    ? "bg-blue-900/30 border-blue-500"
                    : "bg-blue-100 border-blue-400"
                  : canWater
                    ? isDarkMode
                      ? "bg-gray-700 border-gray-600 hover:border-blue-500"
                      : "bg-gray-100 border-gray-300 hover:border-blue-400"
                    : isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-200 border-gray-400"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={canWater ? { scale: 1.03 } : {}}
              onClick={() => canWater && handleWaterClick(member.memberId, member.memberName, member.avatar)}
            >
              <motion.div
                className="text-4xl mb-2"
                animate={member.hasWatered ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {member.avatar}
              </motion.div>
              <div className={`font-medium ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>{member.memberName}</div>

              {member.hasWatered ? (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-1 text-blue-500 font-medium text-sm">
                    <Droplets className="w-4 h-4" />
                    <span>물 줌</span>
                  </div>
                  {member.wateredAt && (
                    <div className="text-xs opacity-70 mt-1">
                      {format(new Date(member.wateredAt), "HH:mm", { locale: ko })}
                    </div>
                  )}
                </motion.div>
              ) : hasWateredToday ? (
                <div className="text-xs opacity-50 mt-2">오늘 이미 완료</div>
              ) : (
                <div className="text-xs opacity-50 mt-2">클릭해서 물주기</div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 모든 가족이 물을 준 경우 축하 메시지 */}
      {allWatered && (
        <motion.div
          className="mt-4 p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-medium text-lg">🎉 모든 가족이 물을 주었습니다!</div>
          <div className="text-sm mt-1">영양제 1개가 추가되었습니다</div>
        </motion.div>
      )}
    </div>
  )
}
