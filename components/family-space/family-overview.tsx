"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"

interface FamilyMember {
  id: string
  name: string
  plan: string
  usage: string
  avatar: string
}

interface FamilyOverviewProps {
  familyMembers: FamilyMember[]
  totalSavings: number
}

export function FamilyOverview({ familyMembers = [], totalSavings }: FamilyOverviewProps) {
  const { isDarkMode } = useTheme()

  // 안전한 배열 확인
  const safeFamilyMembers = familyMembers || []

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"} h-full`}>
      <CardHeader>
        <CardTitle className="flex items-center text-[#388E3C]">
          <Users className="w-5 h-5 mr-2" />
          우리 가족 ({safeFamilyMembers.length}명)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-3xl font-bold text-[#388E3C] mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            월 {totalSavings.toLocaleString()}원 절약
          </motion.div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70`}>투게더 결합 할인</p>
        </motion.div>

        <div className="space-y-4">
          {safeFamilyMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-[#F1F8E9]"
              } hover:shadow-md transition-shadow`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <motion.span
                  className="text-3xl mr-4"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {member.avatar}
                </motion.span>
                <div>
                  <div className="font-medium text-[#388E3C]">{member.name}</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70`}>
                    {member.plan}
                  </div>
                </div>
              </div>
              <Badge className="bg-[#81C784] text-white">{member.usage}</Badge>
            </motion.div>
          ))}
        </div>

        {safeFamilyMembers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>아직 가족 구성원이 없습니다.</p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-2`}>
              초대 탭에서 가족을 초대해보세요!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
