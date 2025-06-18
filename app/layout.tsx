import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeProvider } from "@/contexts/theme-context"
import { FamilySpaceProvider } from "@/contexts/family-space-context"
import { PlantProvider } from "@/contexts/plant-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MODi - 스마트한 통신 생활의 시작",
  description: "개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">

    <head>
      {/* 파비콘 및 아이콘 설정 */}
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
    </head>

      <body className={inter.className}>
        <ThemeProvider>
          <FamilySpaceProvider>
            <PlantProvider>
              <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-[#81C784] p-4 flex items-center">
                <MobileNav />
                <div className="ml-2 text-xl font-bold text-[#388E3C]">MODi</div>
              </div>
              <div className="md:pt-0 pt-16">{children}</div>
            </PlantProvider>
          </FamilySpaceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
