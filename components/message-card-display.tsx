"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"

interface MessageCardDisplayProps {
  design: string
  message: string
  sender: string
  timestamp: Date
  className?: string
  onClick?: () => void
}

const cardDesigns = {
  flower: {
    name: "꽃",
    emoji: "🌸",
    gradient: "bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300",
    darkGradient: "bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-pink-800/40",
    pattern: "🌸🌺🌸",
    textColor: "text-pink-800",
    darkTextColor: "text-pink-200",
  },
  heart: {
    name: "하트",
    emoji: "❤️",
    gradient: "bg-gradient-to-br from-red-200 via-pink-200 to-red-300",
    darkGradient: "bg-gradient-to-br from-red-900/40 via-pink-900/40 to-red-800/40",
    pattern: "💕❤️💕",
    textColor: "text-red-800",
    darkTextColor: "text-red-200",
  },
  star: {
    name: "별",
    emoji: "⭐",
    gradient: "bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300",
    darkGradient: "bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-yellow-800/40",
    pattern: "⭐✨⭐",
    textColor: "text-yellow-800",
    darkTextColor: "text-yellow-200",
  },
  rainbow: {
    name: "무지개",
    emoji: "🌈",
    gradient: "bg-gradient-to-br from-blue-200 via-green-200 to-purple-200",
    darkGradient: "bg-gradient-to-br from-blue-900/40 via-green-900/40 to-purple-900/40",
    pattern: "🌈☀️🌈",
    textColor: "text-blue-800",
    darkTextColor: "text-blue-200",
  },
  butterfly: {
    name: "나비",
    emoji: "🦋",
    gradient: "bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300",
    darkGradient: "bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-800/40",
    pattern: "🦋🌿🦋",
    textColor: "text-purple-800",
    darkTextColor: "text-purple-200",
  },
}

export function MessageCardDisplay({
  design,
  message,
  sender,
  timestamp,
  className,
  onClick,
}: MessageCardDisplayProps) {
  const { isDarkMode } = useTheme()
  const cardDesign = cardDesigns[design as keyof typeof cardDesigns] || cardDesigns.flower

  return (
    <Card
      className={`
        ${isDarkMode ? cardDesign.darkGradient : cardDesign.gradient}
        border-2 border-[#81C784] shadow-md relative overflow-hidden
        ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-4xl transform rotate-12 absolute top-1 right-1">{cardDesign.emoji}</div>
          <div className="text-3xl transform -rotate-12 absolute bottom-1 left-1">{cardDesign.emoji}</div>
          <div className="text-2xl transform rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {cardDesign.emoji}
          </div>
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{cardDesign.emoji}</span>
            <span className={`text-xs font-medium ${isDarkMode ? cardDesign.darkTextColor : cardDesign.textColor}`}>
              {cardDesign.pattern}
            </span>
          </div>
          <span className={`text-xs opacity-70 ${isDarkMode ? cardDesign.darkTextColor : cardDesign.textColor}`}>
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <p
            className={`
              text-center font-medium leading-relaxed text-sm
              ${isDarkMode ? cardDesign.darkTextColor : cardDesign.textColor}
            `}
          >
            {message}
          </p>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 text-right mt-3">
          <p
            className={`
              text-xs font-medium
              ${isDarkMode ? cardDesign.darkTextColor : cardDesign.textColor}
            `}
          >
            From. {sender} 💕
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
