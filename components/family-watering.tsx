"use client"

import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export function FamilyWatering() {
  const { isDarkMode } = useTheme()
  const { familyWatering } = usePlant()

  const allWatered = familyWatering.every((member) => member.hasWatered)

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>가족 물주기 현황</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {familyWatering.map((member) => (
          <motion.div
            key={member.memberId}
            className={`p-4 rounded-lg text-center ${
              member.hasWatered
                ? isDarkMode
                  ? "bg-blue-900/30 border border-blue-700"
                  : "bg-blue-100 border border-blue-300"
                : isDarkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-gray-100 border border-gray-300"
            }`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-4xl mb-2">{member.avatar}</div>
            <div className={`font-medium ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>{member.memberName}</div>
            {member.hasWatered ? (
              <div className="mt-2">
                <div className="text-xs text-blue-500 font-medium">💧 물 줌</div>
                {member.wateredAt && (
                  <div className="text-xs opacity-70 mt-1">
                    {format(new Date(member.wateredAt), "HH:mm", { locale: ko })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs opacity-50 mt-2">아직 물을 주지 않았어요</div>
            )}
          </motion.div>
        ))}
      </div>

      {allWatered && (
        <motion.div
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-medium">🎉 모든 가족이 물을 주었습니다!</div>
          <div className="text-sm mt-1">영양제 1개가 추가되었습니다</div>
        </motion.div>
      )}
    </div>
  )
}
