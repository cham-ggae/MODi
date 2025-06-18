"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import { X, Check } from "lucide-react"

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  type: "ox" | "lastLeaf"
}

interface Question {
  id: string
  question: string
  answer: boolean | string
  options?: string[]
  explanation: string
}

const oxQuestions: Question[] = [
  {
    id: "ox1",
    question: "5G 요금제는 LTE 요금제보다 항상 더 비싸다.",
    answer: false,
    explanation: "5G 요금제 중에서도 저가형 요금제는 일부 LTE 요금제보다 저렴할 수 있습니다.",
  },
  {
    id: "ox2",
    question: "가족 결합 할인은 가족 구성원이 많을수록 할인율이 높아진다.",
    answer: true,
    explanation: "가족 결합 할인은 일반적으로 가족 구성원 수에 비례하여 할인율이 증가합니다.",
  },
  {
    id: "ox3",
    question: "데이터 무제한 요금제를 사용하면 속도 제한 없이 무한정 사용할 수 있다.",
    answer: false,
    explanation: "대부분의 '무제한' 요금제는 일정 사용량 이후 속도 제한이 적용됩니다.",
  },
]

const lastLeafQuestions: Question[] = [
  {
    id: "ll1",
    question: "다음 중 데이터를 가장 많이 사용하는 사용자에게 적합한 요금제는?",
    answer: "5G 프리미엄",
    options: ["5G 라이트", "5G 스탠다드", "5G 프리미엄", "LTE 선택형"],
    explanation: "5G 프리미엄은 대용량 데이터를 제공하여 데이터를 많이 사용하는 사용자에게 적합합니다.",
  },
  {
    id: "ll2",
    question: "통화를 주로 하는 사용자에게 가장 적합한 요금제 유형은?",
    answer: "통화 무제한형",
    options: ["데이터 중심형", "통화 무제한형", "부가서비스형", "저가형"],
    explanation: "통화 무제한형 요금제는 통화량이 많은 사용자에게 가장 경제적입니다.",
  },
  {
    id: "ll3",
    question: "가족 구성원 모두가 데이터를 공유하기에 가장 좋은 요금제는?",
    answer: "데이터 쉐어링 요금제",
    options: ["개인별 요금제", "데이터 쉐어링 요금제", "부가서비스 요금제", "선불 요금제"],
    explanation: "데이터 쉐어링 요금제는 가족 구성원이 하나의 데이터 풀을 공유할 수 있어 효율적입니다.",
  },
]

export function QuizModal({ isOpen, onClose, onComplete, type }: QuizModalProps) {
  const { isDarkMode } = useTheme()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const questions = type === "ox" ? oxQuestions : lastLeafQuestions
  const currentQuestion = questions[currentQuestionIndex]

  if (!isOpen) return null

  const handleAnswer = (answer: boolean | string) => {
    setSelectedAnswer(answer)
    setIsAnswered(true)
    setIsCorrect(answer === currentQuestion.answer)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Quiz completed
      onComplete()
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg">
        <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <h2 className={`text-center text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
              {type === "ox" ? "OX 퀴즈" : "마지막잎새 퀴즈"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>

          <div className="space-y-6 px-4 pb-6">
            {/* Question */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {type === "ox" ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    disabled={isAnswered}
                    className={`h-16 text-lg ${
                      isAnswered && selectedAnswer === true
                        ? isCorrect
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-red-500 hover:bg-red-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    O
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    disabled={isAnswered}
                    className={`h-16 text-lg ${
                      isAnswered && selectedAnswer === false
                        ? isCorrect
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-red-500 hover:bg-red-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    X
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentQuestion.options?.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full justify-start text-left ${
                        isAnswered && selectedAnswer === option
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Explanation (when answered) */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? isDarkMode
                      ? "bg-green-900/30 border border-green-700"
                      : "bg-green-100 border border-green-300"
                    : isDarkMode
                      ? "bg-red-900/30 border border-red-700"
                      : "bg-red-100 border border-red-300"
                }`}
              >
                <div className="flex items-center mb-2">
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className={`font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                        정답입니다!
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <span className={`font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>오답입니다</span>
                    </>
                  )}
                </div>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <Button onClick={handleNext} className="w-full bg-[#81C784] hover:bg-[#388E3C] text-white">
                {currentQuestionIndex < questions.length - 1 ? "다음 문제" : "완료"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
