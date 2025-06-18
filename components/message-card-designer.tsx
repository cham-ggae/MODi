"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"

interface CardDesign {
  id: string
  name: string
  emoji: string
  gradient: string
  darkGradient: string
  pattern: string
  textColor: string
  darkTextColor: string
}

const cardDesigns: CardDesign[] = [
  {
    id: "flower",
    name: "꽃",
    emoji: "🌸",
    gradient: "bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300",
    darkGradient: "bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-pink-800/40",
    pattern: "🌸🌺🌸",
    textColor: "text-pink-800",
    darkTextColor: "text-pink-200",
  },
  {
    id: "heart",
    name: "하트",
    emoji: "❤️",
    gradient: "bg-gradient-to-br from-red-200 via-pink-200 to-red-300",
    darkGradient: "bg-gradient-to-br from-red-900/40 via-pink-900/40 to-red-800/40",
    pattern: "💕❤️💕",
    textColor: "text-red-800",
    darkTextColor: "text-red-200",
  },
  {
    id: "star",
    name: "별",
    emoji: "⭐",
    gradient: "bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300",
    darkGradient: "bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-yellow-800/40",
    pattern: "⭐✨⭐",
    textColor: "text-yellow-800",
    darkTextColor: "text-yellow-200",
  },
  {
    id: "rainbow",
    name: "무지개",
    emoji: "🌈",
    gradient: "bg-gradient-to-br from-blue-200 via-green-200 to-purple-200",
    darkGradient: "bg-gradient-to-br from-blue-900/40 via-green-900/40 to-purple-900/40",
    pattern: "🌈☀️🌈",
    textColor: "text-blue-800",
    darkTextColor: "text-blue-200",
  },
  {
    id: "butterfly",
    name: "나비",
    emoji: "🦋",
    gradient: "bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300",
    darkGradient: "bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-800/40",
    pattern: "🦋🌿🦋",
    textColor: "text-purple-800",
    darkTextColor: "text-purple-200",
  },
]

interface MessageCardDesignerProps {
  onSendCard: (design: string, message: string) => void
}

export function MessageCardDesigner({ onSendCard }: MessageCardDesignerProps) {
  const { isDarkMode } = useTheme()
  const [selectedDesign, setSelectedDesign] = useState<CardDesign | null>(null)
  const [message, setMessage] = useState("")

  const handleDesignSelect = (design: CardDesign) => {
    setSelectedDesign(design)
    if (!message) {
      setMessage("안녕하세요! 좋은 하루 보내세요 😊")
    }
  }

  const handleSendCard = () => {
    if (selectedDesign && message.trim()) {
      onSendCard(selectedDesign.id, message)
      setSelectedDesign(null)
      setMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Design Selection */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
          카드 디자인을 선택하세요
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {cardDesigns.map((design) => (
            <motion.div
              key={design.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              onClick={() => handleDesignSelect(design)}
            >
              <Card
                className={`
                  ${isDarkMode ? design.darkGradient : design.gradient}
                  border-2 transition-all duration-200
                  ${
                    selectedDesign?.id === design.id
                      ? "border-[#388E3C] shadow-lg scale-105"
                      : isDarkMode
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-200 hover:border-[#81C784]"
                  }
                `}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{design.emoji}</div>
                  <div className="text-xs opacity-70">{design.pattern}</div>
                  <p className={`text-xs font-medium mt-2 ${isDarkMode ? design.darkTextColor : design.textColor}`}>
                    {design.name}
                  </p>
                </CardContent>
              </Card>
              {selectedDesign?.id === design.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#388E3C] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Preview & Message Input */}
      {selectedDesign && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
            카드 미리보기 및 메시지 편집
          </h3>

          {/* Card Preview */}
          <div className="flex justify-center">
            <Card
              className={`
                w-80 h-48 ${isDarkMode ? selectedDesign.darkGradient : selectedDesign.gradient}
                border-2 border-[#81C784] shadow-lg relative overflow-hidden
              `}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="text-6xl transform rotate-12 absolute top-2 right-2">{selectedDesign.emoji}</div>
                  <div className="text-4xl transform -rotate-12 absolute bottom-2 left-2">{selectedDesign.emoji}</div>
                  <div className="text-3xl transform rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {selectedDesign.emoji}
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{selectedDesign.emoji}</div>
                    <div className="text-sm opacity-80">{selectedDesign.pattern}</div>
                  </div>
                </div>

                <div className="relative z-10">
                  <p
                    className={`
                      text-center font-medium leading-relaxed
                      ${isDarkMode ? selectedDesign.darkTextColor : selectedDesign.textColor}
                    `}
                  >
                    {message || "메시지를 입력해주세요..."}
                  </p>
                </div>

                <div className="relative z-10 text-right">
                  <p
                    className={`
                      text-xs opacity-70
                      ${isDarkMode ? selectedDesign.darkTextColor : selectedDesign.textColor}
                    `}
                  >
                    From. 가족 💕
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>
              메시지 내용
            </label>
            <Input
              placeholder="가족에게 전할 메시지를 입력하세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`border-[#81C784] focus-visible:ring-[#81C784] ${isDarkMode ? "bg-gray-700 text-white" : ""}`}
              maxLength={100}
            />
            <div className="flex justify-between items-center">
              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {message.length}/100자
              </span>
              <Button
                onClick={handleSendCard}
                disabled={!message.trim()}
                className="bg-[#81C784] hover:bg-[#388E3C] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                카드 보내기
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
