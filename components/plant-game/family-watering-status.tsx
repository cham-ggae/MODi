"use client"

import { motion } from "framer-motion"
import { Check, Droplets } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export function FamilyWateringStatus() {
  const { isDarkMode } = useTheme()
  const { familyWatering } = usePlant()

  const allWatered = familyWatering.every((member) => member.hasWatered)
  const wateredCount = familyWatering.filter((member) => member.hasWatered).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>가족 물주기 현황</h3>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {familyWatering.map((member, index) => (
          <motion.div
            key={member.memberId}
            className={`p-4 rounded-lg text-center border-2 transition-all ${
              member.hasWatered
                ? isDarkMode
                  ? "bg-blue-900/30 border-blue-500"
                  : "bg-blue-100 border-blue-400"
                : isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
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
                  <span>물주기 완료</span>
                </div>
                {member.wateredAt && (
                  <div className="text-xs opacity-70 mt-1">
                    {format(new Date(member.wateredAt), "HH:mm", { locale: ko })}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-xs opacity-50 mt-2">아직 물을 주지 않았어요</div>
            )}
          </motion.div>
        ))}
      </div>

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
