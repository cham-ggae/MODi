"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, MessageCircle, Users, Sprout, User, LogOut, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useFamilySpace } from "@/contexts/family-space-context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { hasFamilySpace } = useFamilySpace()

  const menuItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "메인페이지",
      disabled: false,
    },
    {
      href: "/chat",
      icon: MessageCircle,
      label: "챗봇",
      disabled: false,
    },
    {
      href: "/family-space",
      icon: Users,
      label: "가족 스페이스",
      disabled: !hasFamilySpace,
    },
    {
      href: "/plant-game",
      icon: Sprout,
      label: "새싹 키우기",
      disabled: !hasFamilySpace,
    },
    {
      href: "/my-page",
      icon: User,
      label: "마이페이지",
      disabled: false,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-800">
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-[#388E3C]" onClick={() => setOpen(false)}>
            MODi
          </Link>
          <ThemeToggle variant="ghost" size="icon" />
        </div>

        <nav className="px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  {item.disabled ? (
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-not-allowed opacity-50",
                        "text-[#4E342E] dark:text-gray-300",
                      )}
                      title="가족 스페이스를 먼저 생성해주세요"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-[#81C784] text-white shadow-sm"
                          : "text-[#4E342E] dark:text-gray-300 hover:bg-[#F1F8E9] dark:hover:bg-gray-700 hover:text-[#388E3C]",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 mt-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => setOpen(false)}
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
