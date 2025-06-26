import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { FamilySpaceProvider } from '@/contexts/family-space-context';
import { PlantProvider } from '@/contexts/plant-context-v2';
import AuthProvider from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: 'MODi',
  description: '개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스',
  openGraph: {
    title: 'MODi',
    description: '개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스',
    type: 'website',
    url: baseUrl,
    siteName: 'MODi',
    images: [
      {
        url: `${baseUrl}/images/modi-logo-small.png`,
        width: 1200,
        height: 630,
        alt: 'MODi 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MODi - 스마트한 통신 생활의 시작',
    description: '개인 맞춤형 요금제 추천 및 가족 통신 관리 서비스',
    images: [`${baseUrl}/images/modi-logo-small.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-screen bg-[#f5f5f5]">
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

      <body className={`${inter.className} h-screen w-full flex items-center justify-center`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <FamilySpaceProvider>
                <PlantProvider>{children}</PlantProvider>
              </FamilySpaceProvider>
            </AuthProvider>
          </QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
