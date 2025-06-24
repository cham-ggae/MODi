'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';
import { Users, MessageCircle, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { hasFamilySpace } = useFamilySpaceStatus();

  const navItems = [
    {
      href: hasFamilySpace ? '/family-space' : '/family-space-tutorial',
      icon: Users,
      label: '가족',
      isActive: pathname.startsWith('/family-space'),
    },
    {
      href: '/chat',
      icon: MessageCircle,
      label: '챗봇',
      isActive: pathname.startsWith('/chat'),
    },
    {
      href: '/my-page',
      icon: User,
      label: '마이페이지',
      isActive: pathname.startsWith('/my-page'),
    },
  ];

  return (
    <div className="flex justify-around py-2 border-t bg-white dark:bg-gray-800">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center space-y-1 w-20"
        >
          <item.icon
            className={cn(
              'w-6 h-6',
              item.isActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            )}
          />
          <span
            className={cn(
              'text-xs',
              item.isActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
            )}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
