"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { type ReactNode, useState } from "react"

interface ActionButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  effectType?: "water" | "fertilizer"
}

export function ActionButton({ children, onClick, disabled, className, effectType = "water" }: ActionButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled || isAnimating) return

    setIsAnimating(true)
    onClick()

    setTimeout(() => {
      setIsAnimating(false)
    }, 2000)
  }

  const getEffectColor = () => {
    return effectType === "water" ? "bg-blue-400" : "bg-yellow-400"
  }

  const getEffectEmoji = () => {
    return effectType === "water" ? "💧" : "⚡"
  }

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }}>
        <Button
          onClick={handleClick}
          disabled={disabled || isAnimating}
          className={`${className} relative overflow-hidden`}
        >
          <motion.div
            animate={isAnimating ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? 3 : 0 }}
          >
            {children}
          </motion.div>
        </Button>
      </motion.div>

      {/* Effect Animation */}
      {isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${getEffectColor()} rounded-full pointer-events-none`}
              style={{
                top: "50%",
                left: "50%",
              }}
              initial={{
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                y: Math.sin((i * 45 * Math.PI) / 180) * 60,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Emoji Effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`emoji-${i}`}
              className="absolute text-2xl pointer-events-none"
              style={{
                top: "20%",
                left: `${30 + i * 20}%`,
              }}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -50,
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            >
              {getEffectEmoji()}
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}
