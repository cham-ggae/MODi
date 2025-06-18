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
        'md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-[#81C784] p-4 flex items-center',
        className
      )}
    >
      {showNav && (
        <div className="flex items-center justify-between w-full">
          {leftAction}
          <div className="flex-1 flex items-center justify-center">
            {title && <h1 className="text-xl font-bold text-[#388E3C]">{title}</h1>}
          </div>
          {rightAction}
        </div>
      )}
      {children}
    </div>
  );
}
