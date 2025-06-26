"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useTheme as useNextTheme } from "next-themes"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme, setTheme } = useNextTheme()

  const toggleTheme = () => {
    setTheme(nextTheme === "light" ? "dark" : "light")
  }

  const contextValue = {
    theme: (nextTheme as Theme) || "light",
    toggleTheme,
    isDarkMode: nextTheme === "dark",
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
