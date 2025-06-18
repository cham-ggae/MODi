"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypingAnimation({ text, className = "", speed = 100 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  // 줄바꿈 처리를 위해 텍스트를 분할하고 <br> 태그로 변환
  const formatText = (text: string) => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {formatText(displayedText)}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="inline-block w-0.5 h-6 bg-current ml-1"
        />
      )}
    </motion.div>
  )
}
