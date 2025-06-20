import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { FamilySpaceProvider } from "@/contexts/family-space-context";
import { PlantProvider } from "@/contexts/plant-context";
import AuthProvider from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { MobileHeader } from "@/components/layouts/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MODi - 스마트한 통신 생활의 시작",
  description: "개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
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

      <body className={`${inter.className} h-full overflow-hidden`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <FamilySpaceProvider>
                <PlantProvider>
                  {/* 전체 화면을 차지하는 컨테이너 */}
                  <div className="h-full w-full flex flex-col overflow-hidden">
                    {/* 헤더는 앱 그룹에만 표시 */}
                    <div className="md:hidden flex-shrink-0">
                      <MobileHeader leftAction={<MobileNav />} title="MODi" />
                    </div>

                    {/* 메인 콘텐츠 영역 - 헤더 제외한 나머지 공간 */}
                    <div className="flex-1 overflow-hidden md:pt-0 pt-16">{children}</div>
                  </div>
                </PlantProvider>
              </FamilySpaceProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
