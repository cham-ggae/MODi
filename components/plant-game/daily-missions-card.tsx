"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DailyMissions } from "@/components/daily-missions"
import { useTheme } from "@/contexts/theme-context"

interface DailyMissionsCardProps {
  onWater: () => void
}

export function DailyMissionsCard({ onWater }: DailyMissionsCardProps) {
  const { isDarkMode } = useTheme()

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <CardHeader>
        <CardTitle className="text-[#388E3C]">오늘의 미션</CardTitle>
      </CardHeader>
      <CardContent>
        <DailyMissions onWater={onWater} />
      </CardContent>
    </Card>
  )
}
