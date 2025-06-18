"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MessageCircle, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFamilySpaceStatus } from "@/hooks/use-family-space"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { hasFamilySpace, isLoading } = useFamilySpaceStatus()

  const handleFamilyNavigation = () => {
    if (isLoading) return

    if (hasFamilySpace) {
      router.push("/family-space")
    } else {
      router.push("/family-space-tutorial")
    }
  }

  const navItems = [
    {
      href: "/family-space",
      icon: Users,
      label: "가족",
      onClick: handleFamilyNavigation,
    },
    {
      href: "/chat",
      icon: MessageCircle,
      label: "챗봇",
    },
    {
      href: "/my-page",
      icon: User,
      label: "마이페이지",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto h-16">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/family-space" && pathname.includes("family"))
          const Icon = item.icon

          if (item.onClick) {
            return (
              <button
                key={item.href}
                onClick={item.onClick}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center py-2 px-4 rounded-lg transition-colors disabled:opacity-50 min-w-0",
                  isActive ? "text-green-600" : "text-gray-500 dark:text-gray-400 hover:text-green-600",
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs truncate">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors min-w-0",
                isActive ? "text-green-600" : "text-gray-500 dark:text-gray-400 hover:text-green-600",
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
