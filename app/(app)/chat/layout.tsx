'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Mic, MicOff, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

import { useToast } from '@/hooks/use-toast';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';

export default function ChatLayout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-green-500">MODI</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
      {/* Family Mode Toggle */}
      {children}
      {/* 채팅 메시지 영역만 스크롤 */}

      {/* 입력창 */}

    </div>
  );
}
