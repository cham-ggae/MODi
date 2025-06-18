'use client';

import { useRouter, usePathname } from 'next/navigation';
import { User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasFamilySpace, isLoading } = useFamilySpaceStatus();

  const handleFamilyNavigation = () => {
    if (isLoading) return;

    if (hasFamilySpace) {
      router.push('/family-space');
    } else {
      router.push('/family-space-tutorial');
    }
  };

  // 현재 페이지에 따른 아이콘 활성화 상태
  const isChatActive = pathname === '/chat';
  const isFamilyActive = pathname.startsWith('/family-space');
  const isMyPageActive = pathname === '/my-page';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 max-w-md mx-auto flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>

      {/* Bottom Navigation */}
      <div className="flex justify-around py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 w-full max-w-md mx-auto">
        <button
          onClick={handleFamilyNavigation}
          disabled={isLoading}
          className="flex flex-col items-center space-y-1 disabled:opacity-50"
        >
          <User
            className={`w-6 h-6 ${
              isFamilyActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span
            className={`text-xs ${
              isFamilyActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            가족
          </span>
        </button>
        <Link href="/chat" className="flex flex-col items-center space-y-1">
          <MessageSquare
            className={`w-6 h-6 ${
              isChatActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span
            className={`text-xs ${
              isChatActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            챗봇
          </span>
        </Link>
        <Link href="/my-page" className="flex flex-col items-center space-y-1">
          <User
            className={`w-6 h-6 ${
              isMyPageActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          />
          <span
            className={`text-xs ${
              isMyPageActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            마이페이지
          </span>
        </Link>
      </div>
    </div>
  );
}
