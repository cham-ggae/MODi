"use client"

import type { ReactNode } from "react"

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return <div className="min-h-screen bg-white max-w-md mx-auto relative">{children}</div>
}
