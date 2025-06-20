'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, MessageCircle, Users, Sprout, User, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useFamilySpace } from '@/contexts/family-space-context';
import { useAuth } from '@/hooks/useAuth';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { hasFamilySpace } = useFamilySpace();
  const { logout, isAuthenticated, user } = useAuth();

  const menuItems = [
    {
      href: '/chat',
      icon: MessageCircle,
      label: '챗봇',
      disabled: false,
    },
    {
      href: '/family-space',
      icon: Users,
      label: '가족 스페이스',
      disabled: !hasFamilySpace,
    },
    {
      href: '/plant-game',
      icon: Sprout,
      label: '새싹 키우기',
      disabled: !hasFamilySpace,
    },
    {
      href: '/my-page',
      icon: User,
      label: '마이페이지',
      disabled: false,
    },
  ];

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">MODi</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 로그인 상태 표시 */}
              {isAuthenticated && user && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-200">
                    안녕하세요, {user.nickname}님!
                  </p>
                </div>
              )}
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      {item.disabled ? (
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-not-allowed opacity-50',
                            'text-[#4E342E] dark:text-gray-300'
                          )}
                          title="가족 스페이스를 먼저 생성해주세요"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                            isActive
                              ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}

                {/* 로그아웃 버튼 */}
                {isAuthenticated && (
                  <li className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 p-3 rounded-lg w-full text-left hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
