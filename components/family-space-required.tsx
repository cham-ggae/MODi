"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, ArrowRight } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import Link from "next/link"

export function FamilySpaceRequired() {
  const { isDarkMode } = useTheme()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className={`border-2 border-dashed border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-[#F1F8E9]"}`}>
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-[#81C784] rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-[#388E3C] mb-3">가족 스페이스가 필요해요! 🌱</h2>
            <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} mb-6 text-lg`}>
              새싹 키우기는 가족과 함께하는 특별한 기능입니다
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <Link href="/dashboard">
              <Button className="w-full bg-[#81C784] hover:bg-[#388E3C] text-white h-14 text-lg font-semibold group">
                <Plus className="w-5 h-5 mr-2" />
                가족 스페이스 만들기
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              또는 가족으로부터 받은 초대 코드로 참여하세요
            </p>
          </motion.div>

          {/* 장식적 요소 */}
          <motion.div
            className="absolute top-4 right-4 text-2xl"
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          >
            🌱
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-4 text-xl"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            ✨
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
