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

          {/* Water Effect */}
          {waterEffects && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`water-${i}`}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full pointer-events-none"
                  style={{
                    top: "20%",
                    left: "50%",
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Water Droplet Emojis */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`water-emoji-${i}`}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    top: "10%",
                    left: `${30 + i * 10}%`,
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -50,
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                >
                  💧
                </motion.div>
              ))}
            </>
          )}
        </div>

        <PlantActionButtons onWaterPlant={onWaterPlant} onUseNutrient={onUseNutrient} />
      </CardContent>
    </Card>
  )
}
