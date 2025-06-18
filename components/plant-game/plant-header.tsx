"use client"

import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import { motion } from "framer-motion"

export function PlantHeader() {
  const { isDarkMode } = useTheme()
  const { plantState } = usePlant()

  if (!plantState) return null

  return (
    <motion.div
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-[#388E3C]">
        {plantState.type === "flower" ? "🌸" : "🌳"}
        {plantState.type === "flower" ? "꽃" : "나무"} 키우기
      </h1>
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge className="bg-yellow-500 text-white">🧪 영양제 {plantState.nutrientCount}개</Badge>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge className="bg-[#81C784] text-white">
            {plantState.type === "flower" ? "🌸" : "🌳"} {plantState.completedCount}그루 완성
          </Badge>
        </motion.div>
      </div>
    </motion.div>
  )
}
