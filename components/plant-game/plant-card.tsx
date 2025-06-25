"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PlantDisplay } from "@/components/plant-display"
import { PlantActionButtons } from "@/components/plant-game/plant-action-buttons"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"

interface PlantCardProps {
  onWaterPlant: () => void
  onUseNutrient: () => void
  waterEffects: boolean
}

export function PlantCard({ onWaterPlant, onUseNutrient, waterEffects }: PlantCardProps) {
  const { isDarkMode } = useTheme()

  return (
    <Card
      className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"} relative overflow-hidden mb-6`}
    >
      <CardContent className="p-8">
        <div className="relative">
          <PlantDisplay />
        </div>

        <PlantActionButtons onWaterPlant={onWaterPlant} onUseNutrient={onUseNutrient} />
      </CardContent>
    </Card>
  )
}
