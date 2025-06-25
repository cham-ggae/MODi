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
    </div>
  )
}
