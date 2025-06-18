"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Zap, Gift } from "lucide-react"

interface PlantActionSectionProps {
  onWaterPlant: () => void
  onUseNutrient: () => void
  canWater: boolean
  canUseNutrient: boolean
  waterCooldown: number
  nutrientCooldown: number
  isDarkMode?: boolean
}

export function PlantActionSection({
  onWaterPlant,
  onUseNutrient,
  canWater,
  canUseNutrient,
  waterCooldown,
  nutrientCooldown,
  isDarkMode = false,
}: PlantActionSectionProps) {
  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    } else {
      return `${secs}초`
    }
  }

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* 물주기 버튼 */}
          <div className="space-y-2">
            <Button
              onClick={onWaterPlant}
              disabled={!canWater}
              className={`w-full h-16 text-lg font-semibold transition-all ${
                canWater
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Droplets className="w-6 h-6 mr-2" />
              물주기
            </Button>
            {!canWater && waterCooldown > 0 && (
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  {formatCooldown(waterCooldown)} 후 가능
                </Badge>
              </div>
            )}
            <p className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              식물의 성장에 필수! 💧
            </p>
          </div>

          {/* 영양제 사용 버튼 */}
          <div className="space-y-2">
            <Button
              onClick={onUseNutrient}
              disabled={!canUseNutrient}
              className={`w-full h-16 text-lg font-semibold transition-all ${
                canUseNutrient
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Zap className="w-6 h-6 mr-2" />
              영양제 사용
            </Button>
            {!canUseNutrient && nutrientCooldown > 0 && (
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  {formatCooldown(nutrientCooldown)} 후 가능
                </Badge>
              </div>
            )}
            <p className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              빠른 성장 부스터! ⚡
            </p>
          </div>
        </div>

        {/* 액션 설명 */}
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-[#F1F8E9]"}`}>
          <div className="flex items-center mb-2">
            <Gift className="w-4 h-4 mr-2 text-[#388E3C]" />
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>액션 효과</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>💧 물주기</p>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                • 성장 포인트 +10
                <br />• 24시간마다 가능
                <br />• 가족 모두 참여 가능
              </p>
            </div>
            <div>
              <p className={`font-medium ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>⚡ 영양제</p>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                • 성장 포인트 +25
                <br />• 48시간마다 가능
                <br />• 빠른 성장 효과
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
