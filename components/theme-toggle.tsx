"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ThemeToggle({ variant = "outline", size = "sm", className = "" }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`${className} ${
        isDarkMode
          ? "bg-white text-gray-900 border-white hover:bg-gray-100"
          : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
      } transition-all duration-200`}
    >
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
