"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function BasicInfoPage() {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const router = useRouter()

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender)
    setTimeout(() => setStep(2), 300)
  }

  const handleAgeSelect = (selectedAge: string) => {
    setAge(selectedAge)
    localStorage.setItem("userBasicInfo", JSON.stringify({ gender, age: selectedAge }))
    // /chat으로 리다이렉트 (메인 페이지)
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center p-4">
        <ArrowLeft
          className="w-6 h-6 text-gray-700 cursor-pointer"
          onClick={() => (step === 2 ? setStep(1) : router.back())}
        />
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-12">성별을 선택해주세요</h1>

          <div className="space-y-4">
            <button
              onClick={() => handleGenderSelect("male")}
              className="w-full p-6 bg-white border-2 border-gray-200 rounded-3xl flex items-center space-x-4 hover:border-green-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">👨</div>
              <span className="text-lg font-medium text-gray-900">남성</span>
            </button>

            <button
              onClick={() => handleGenderSelect("female")}
              className="w-full p-6 bg-white border-2 border-gray-200 rounded-3xl flex items-center space-x-4 hover:border-green-400 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">👩</div>
              <span className="text-lg font-medium text-gray-900">여성</span>
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-16">더 나은 서비스 제공을 위한 설문입니다</p>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-12">나이를 선택해주세요</h1>

          <div className="space-y-4">
            {[
              { emoji: "👶", label: "10대" },
              { emoji: "👦", label: "20대" },
              { emoji: "👨", label: "30대" },
              { emoji: "👴", label: "40대" },
              { emoji: "👵", label: "50대 이상" },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => handleAgeSelect(option.label)}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-3xl flex items-center space-x-4 hover:border-green-400 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {option.emoji}
                </div>
                <span className="text-lg font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-16">더 나은 서비스 제공을 위한 설문입니다</p>
        </motion.div>
      )}
    </div>
  )
}
