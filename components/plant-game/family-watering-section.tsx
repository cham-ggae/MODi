"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Users } from "lucide-react"
import type { WaterEventData } from "@/types/water-event"

interface FamilyWateringSectionProps {
  waterEvents: WaterEventData[]
  isDarkMode?: boolean
}

export function FamilyWateringSection({ waterEvents, isDarkMode = false }: FamilyWateringSectionProps) {
  const today = new Date().toDateString()
  const todayEvents = waterEvents.filter((event) => new Date(event.timestamp).toDateString() === today)

  // 가족 구성원별 오늘 물주기 상태
  const familyMembers = [
    { id: "1", name: "아빠", avatar: "👨", fid: "family1" },
    { id: "2", name: "엄마", avatar: "👩", fid: "family2" },
    { id: "3", name: "나", avatar: "🧑", fid: "family3" },
    { id: "4", name: "동생", avatar: "👶", fid: "family4" },
  ]

  const getMemberWateringStatus = (fid: string) => {
    return todayEvents.some((event) => event.fid === fid)
  }

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-[#388E3C] text-lg">
          <Users className="w-5 h-5 mr-2" />
          가족 물주기 현황
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 오늘의 통계 */}
        <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-[#F1F8E9]"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
              오늘 물주기 완료
            </span>
            <Badge className="bg-[#81C784] text-white">
              {todayEvents.length}/{familyMembers.length}명
            </Badge>
          </div>
        </div>

        {/* 가족 구성원별 상태 */}
        <div className="space-y-3">
          {familyMembers.map((member) => {
            const hasWatered = getMemberWateringStatus(member.fid)
            const memberEvent = todayEvents.find((event) => event.fid === member.fid)

            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  hasWatered
                    ? isDarkMode
                      ? "border-green-600 bg-green-900/20"
                      : "border-green-200 bg-green-50"
                    : isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
                    {memberEvent?.avatarUrl && (
                      <AvatarImage src={memberEvent.avatarUrl || "/placeholder.svg"} alt={member.name} />
                    )}
                  </Avatar>
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-[#4E342E]"}`}>
                      {memberEvent?.name || member.name}
                    </p>
                    {hasWatered && memberEvent && (
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(memberEvent.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        에 물주기 완료
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  {hasWatered ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">완료</span>
                    </div>
                  ) : (
                    <div className={`flex items-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <Clock className="w-5 h-5 mr-1" />
                      <span className="text-sm">대기중</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 최근 물주기 활동 */}
        {todayEvents.length > 0 && (
          <div className="mt-4">
            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
              오늘의 물주기 활동
            </h4>
            <div className="space-y-2">
              {todayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 text-xs p-2 rounded ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <span className="text-lg">{event.avatarUrl ? "🌱" : "💧"}</span>
                  <span className={isDarkMode ? "text-gray-300" : "text-[#4E342E]"}>
                    <strong>{event.name}</strong>님이 물을 주었습니다
                  </span>
                  <span className={`ml-auto ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
