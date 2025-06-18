"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const surveyQuestions = [
  {
    id: 1,
    question: "주로 사용하는 데이터량은?",
    options: [
      { emoji: "📱", label: "5GB 미만", value: "low" },
      { emoji: "💻", label: "5-20GB", value: "medium" },
      { emoji: "🎮", label: "20GB 이상", value: "high" },
      { emoji: "🔥", label: "무제한 필요", value: "unlimited" },
    ],
  },
  {
    id: 2,
    question: "통화 사용 패턴은?",
    options: [
      { emoji: "📞", label: "거의 안함", value: "minimal" },
      { emoji: "💬", label: "가끔 사용", value: "occasional" },
      { emoji: "🗣️", label: "자주 사용", value: "frequent" },
      { emoji: "📢", label: "업무용 많이", value: "business" },
    ],
  },
  {
    id: 3,
    question: "가족 구성원 수는?",
    options: [
      { emoji: "👤", label: "1명 (본인)", value: "single" },
      { emoji: "👫", label: "2명", value: "couple" },
      { emoji: "👨‍👩‍👧", label: "3-4명", value: "family" },
      { emoji: "👨‍👩‍👧‍👦", label: "5명 이상", value: "large" },
    ],
  },
]

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const router = useRouter()

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion + 1]: value }
    setAnswers(newAnswers)

    if (currentQuestion < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      // 설문 완료
      localStorage.setItem("surveyAnswers", JSON.stringify(newAnswers))
      localStorage.setItem("surveyCompletedAt", new Date().toISOString())
      setTimeout(() => router.push("/result"), 500)
    }
  }

  const currentQ = surveyQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center p-4">
        <ArrowLeft
          className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={() => (currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : router.back())}
        />
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestion + 1} / {surveyQuestions.length}
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            {Math.round(((currentQuestion + 1) / surveyQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / surveyQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">{currentQ.question}</h1>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-3xl flex items-center space-x-4 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                {option.emoji}
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">{option.label}</span>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-16">
          더 나은 요금제 추천을 위한 설문입니다
        </p>
      </motion.div>
    </div>
  )
}
