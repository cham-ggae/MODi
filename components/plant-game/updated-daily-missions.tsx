"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Target, Gift, Clock, Star } from "lucide-react"

interface Mission {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "special"
  progress: number
  maxProgress: number
  reward: number
  completed: boolean
  icon: string
}

interface UpdatedDailyMissionsProps {
  isDarkMode?: boolean
}

export function UpdatedDailyMissions({ isDarkMode = false }: UpdatedDailyMissionsProps) {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      title: "식물에게 물주기",
      description: "우리 가족 식물에게 사랑의 물을 주세요",
      type: "daily",
      progress: 1,
      maxProgress: 1,
      reward: 10,
      completed: true,
      icon: "💧",
    },
    {
      id: "2",
      title: "가족과 메시지 카드 주고받기",
      description: "따뜻한 메시지로 가족의 마음을 전해보세요",
      type: "daily",
      progress: 0,
      maxProgress: 1,
      reward: 15,
      completed: false,
      icon: "💌",
    },
    {
      id: "3",
      title: "AI 챗봇과 대화하기",
      description: "요금제 상담을 받거나 궁금한 것을 물어보세요",
      type: "daily",
      progress: 0,
      maxProgress: 1,
      reward: 10,
      completed: false,
      icon: "🤖",
    },
    {
      id: "4",
      title: "가족 스페이스 방문하기",
      description: "가족들의 근황을 확인하고 소통해보세요",
      type: "daily",
      progress: 1,
      maxProgress: 1,
      reward: 5,
      completed: true,
      icon: "🏠",
    },
    {
      id: "5",
      title: "연속 접속 달성",
      description: "7일 연속으로 앱에 접속해보세요",
      type: "weekly",
      progress: 3,
      maxProgress: 7,
      reward: 50,
      completed: false,
      icon: "🔥",
    },
    {
      id: "6",
      title: "가족 초대하기",
      description: "새로운 가족 구성원을 초대해보세요",
      type: "special",
      progress: 0,
      maxProgress: 1,
      reward: 100,
      completed: false,
      icon: "👨‍👩‍👧‍👦",
    },
  ])

  const completedMissions = missions.filter((m) => m.completed).length
  const totalRewards = missions.filter((m) => m.completed).reduce((sum, m) => sum + m.reward, 0)

  const getMissionTypeColor = (type: Mission["type"]) => {
    switch (type) {
      case "daily":
        return "bg-blue-500"
      case "weekly":
        return "bg-purple-500"
      case "special":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMissionTypeLabel = (type: Mission["type"]) => {
    switch (type) {
      case "daily":
        return "일일"
      case "weekly":
        return "주간"
      case "special":
        return "특별"
      default:
        return "기본"
    }
  }

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-[#388E3C]">
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            오늘의 미션
          </div>
          <Badge className="bg-[#81C784] text-white">
            {completedMissions}/{missions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 미션 진행 현황 */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-[#F1F8E9]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
              오늘의 진행률
            </span>
            <span className="text-sm font-bold text-[#388E3C]">
              {Math.round((completedMissions / missions.length) * 100)}%
            </span>
          </div>
          <Progress value={(completedMissions / missions.length) * 100} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>완료된 미션: {completedMissions}개</span>
            <span className="text-[#388E3C] font-medium flex items-center">
              <Gift className="w-3 h-3 mr-1" />
              {totalRewards} 포인트 획득
            </span>
          </div>
        </div>

        {/* 미션 목록 */}
        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-lg border transition-all ${
                mission.completed
                  ? isDarkMode
                    ? "border-green-600 bg-green-900/20"
                    : "border-green-200 bg-green-50"
                  : isDarkMode
                    ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                    : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">{mission.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-[#4E342E]"}`}>{mission.title}</h4>
                      <Badge className={`${getMissionTypeColor(mission.type)} text-white text-xs px-2 py-0.5`}>
                        {getMissionTypeLabel(mission.type)}
                      </Badge>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>
                      {mission.description}
                    </p>

                    {/* 진행률 */}
                    {mission.maxProgress > 1 && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>진행률</span>
                          <span className={isDarkMode ? "text-gray-300" : "text-[#4E342E]"}>
                            {mission.progress}/{mission.maxProgress}
                          </span>
                        </div>
                        <Progress value={(mission.progress / mission.maxProgress) * 100} className="h-1.5" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs">
                        <Gift className="w-3 h-3 mr-1 text-[#388E3C]" />
                        <span className="text-[#388E3C] font-medium">{mission.reward} 포인트</span>
                      </div>

                      {mission.completed ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">완료</span>
                        </div>
                      ) : (
                        <div className={`flex items-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-xs">진행중</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 특별 보상 안내 */}
        <div
          className={`p-3 rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-yellow-600 bg-yellow-900/20" : "border-yellow-300 bg-yellow-50"
          }`}
        >
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>
                모든 일일 미션 완료 시 보너스 +20 포인트!
              </p>
              <p className={`text-xs ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                매일 꾸준히 참여해서 더 많은 보상을 받아보세요
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
