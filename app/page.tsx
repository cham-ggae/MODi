"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Smartphone, Users, MessageCircle, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="text-center pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">MODI</h1>
        </motion.div>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          가족과 함께하는
          <br />
          <span className="text-green-600 dark:text-green-400 font-semibold">스마트한 요금제 관리</span>
        </motion.p>
      </div>

      {/* Features */}
      <div className="flex-1 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">요금제 분석</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">맞춤형 추천</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">가족 결합</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">할인 혜택</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI 상담</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">24시간 지원</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">비용 절약</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">최적화</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="px-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Link href="/basic-info">
            <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-2xl text-lg mb-4 shadow-xl">
              시작하기
            </Button>
          </Link>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            로그인하면 서비스 약관 및 개인정보처리방침에
            <br />
            동의하는 것으로 간주됩니다
          </p>
        </motion.div>
      </div>
    </div>
  )
}
