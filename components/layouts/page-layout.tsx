'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'white' | 'gray';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-900',
  gradient:
    'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
  white: 'bg-white dark:bg-gray-900',
  gray: 'bg-gray-50 dark:bg-gray-900',
};

const maxWidthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

const paddingStyles = {
  none: '',
  sm: 'px-4 py-4',
  md: 'px-6 py-6',
  lg: 'px-8 py-8',
};

export function PageLayout({
  children,
  className,
  variant = 'default',
  maxWidth = 'md',
  padding = 'none',
  header,
  footer,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen mx-auto flex flex-col',
        variantStyles[variant],
        maxWidthStyles[maxWidth],
        className
      )}
    >
      {header && <div className="flex-shrink-0">{header}</div>}

      <main className={cn('flex-1', paddingStyles[padding])}>{children}</main>

      {footer && <div className="flex-shrink-0">{footer}</div>}
    </div>
  );
}
