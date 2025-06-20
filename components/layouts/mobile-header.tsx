'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  children?: ReactNode;
  className?: string;
  showNav?: boolean;
  title?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function MobileHeader({
  children,
  className,
  showNav = true,
  title,
  leftAction,
  rightAction,
}: MobileHeaderProps) {
  return (
    <div
      className={cn(
        'md:hidden bg-white dark:bg-gray-800 border-b border-[#81C784] p-4 flex items-center justify-between',
        className
      )}
    >
      <div className="w-10">{leftAction}</div>
      <div className="flex-1 text-center">
        {title && <h1 className="text-xl font-bold text-[#388E3C]">{title}</h1>}
      </div>
      <div className="w-10">{rightAction}</div>
      {children}
    </div>
  );
}
