"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FamilySpaceIntroPage() {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col items-center justify-center px-8">
      {/* Plant Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="text-8xl">🌱</div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">가족이 모이면,</h1>
        <h2 className="text-2xl font-bold text-gray-900">작은 새싹도 자라나요</h2>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <Link href="/family-space">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl text-lg">
            가족 스페이스 생성 →
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
