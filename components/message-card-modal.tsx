"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

interface MessageCardModalProps {
  onSendCard: (design: string, message: string) => void
  children: React.ReactNode
}

export function MessageCardModal({ onSendCard, children }: MessageCardModalProps) {
  const { isDarkMode } = useTheme()
  const [open, setOpen] = useState(false)
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0)
  const [message, setMessage] = useState("")

  const currentDesign = cardDesigns[currentDesignIndex]

  const handlePreviousDesign = () => {
    setCurrentDesignIndex((prev) => (prev === 0 ? cardDesigns.length - 1 : prev - 1))
  }

  const handleNextDesign = () => {
    setCurrentDesignIndex((prev) => (prev === cardDesigns.length - 1 ? 0 : prev + 1))
  }

  const handleSendCard = () => {
    if (message.trim()) {
      onSendCard(currentDesign.id, message)
      setMessage("")
      setCurrentDesignIndex(0)
      setOpen(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && !message) {
      setMessage("안녕하세요! 좋은 하루 보내세요 😊")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-center text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
            메시지 카드 보내기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Design Slider */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold text-center ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
              카드 디자인 선택
            </h3>

            {/* Card Carousel */}
            <div className="relative">
              <div className="flex justify-center">
                <div className="relative w-80 h-48 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDesignIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Card
                        className={`
                          w-full h-full ${isDarkMode ? currentDesign.darkGradient : currentDesign.gradient}
                          border-2 border-[#81C784] shadow-lg relative overflow-hidden
                        `}
                      >
                        <CardContent className="p-6 h-full flex flex-col justify-between relative">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="text-6xl transform rotate-12 absolute top-2 right-2">
                              {currentDesign.emoji}
                            </div>
                            <div className="text-4xl transform -rotate-12 absolute bottom-2 left-2">
                              {currentDesign.emoji}
                            </div>
                            <div className="text-3xl transform rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              {currentDesign.emoji}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="relative z-10">
                            <div className="text-center mb-4">
                              <div className="text-3xl mb-2">{currentDesign.emoji}</div>
                              <div className="text-sm opacity-80">{currentDesign.pattern}</div>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <p
                              className={`
                                text-center font-medium leading-relaxed
                                ${isDarkMode ? currentDesign.darkTextColor : currentDesign.textColor}
                              `}
                            >
                              {message || "메시지를 입력해주세요..."}
                            </p>
                          </div>

                          <div className="relative z-10 text-right">
                            <p
                              className={`
                                text-xs opacity-70
                                ${isDarkMode ? currentDesign.darkTextColor : currentDesign.textColor}
                              `}
                            >
                              From. 가족 💕
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full ${
                  isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white/80 hover:bg-white"
                }`}
                onClick={handlePreviousDesign}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full ${
                  isDarkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white/80 hover:bg-white"
                }`}
                onClick={handleNextDesign}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Design Indicators */}
            <div className="flex justify-center space-x-2">
              {cardDesigns.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentDesignIndex
                      ? "bg-[#388E3C] w-6"
                      : isDarkMode
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentDesignIndex(index)}
                />
              ))}
            </div>

            {/* Design Name */}
            <div className="text-center">
              <span
                className={`text-lg font-semibold ${isDarkMode ? currentDesign.darkTextColor : currentDesign.textColor}`}
              >
                {currentDesign.emoji} {currentDesign.name} 카드
              </span>
            </div>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className={isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}
            >
              취소
            </Button>
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
      </DialogContent>
    </Dialog>
  )
}
