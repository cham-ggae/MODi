"use client"

import { motion } from "framer-motion"
import { Droplets } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context-v2"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export function FamilyWateringStatusCard() {
  const { isDarkMode } = useTheme()
  const { familyWatering } = usePlant()

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>가족 물주기 현황</h3>

      <div className="grid grid-cols-3 gap-4">
        {familyWatering.map((member, index) => (
          <motion.div
            key={member.memberId}
            className={`p-4 rounded-lg text-center transition-all ${
              member.hasWatered
                ? isDarkMode
                  ? "bg-blue-900/30 border-2 border-blue-500"
                  : "bg-blue-100 border-2 border-blue-400"
                : isDarkMode
                  ? "bg-gray-700 border-2 border-gray-600"
                  : "bg-gray-100 border-2 border-gray-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              className="text-4xl mb-2"
              animate={member.hasWatered ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {member.avatar}
            </motion.div>
            <div className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
              {member.memberName}
            </div>

            {member.hasWatered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-center gap-1 text-blue-500 font-medium text-sm">
                  <Droplets className="w-4 h-4" />
                  <span>물 줌</span>
                </div>
                {member.wateredAt && (
                  <div className="text-xs opacity-70">
                    {format(new Date(member.wateredAt), "HH:mm", { locale: ko })}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-xs opacity-50">아직 물을 주지 않았어요</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
