'use client';

import React, { useRef, memo } from 'react';
import { useResponsiveScale } from '@/hooks/use-responsive-scale';

const BASE_WIDTH = 430;
const BASE_HEIGHT = 932;

interface ResponsiveWrapperProps {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

export const ResponsiveWrapper = memo(function ResponsiveWrapper({
  header,
  main,
  footer,
}: ResponsiveWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scaleStyle = useResponsiveScale({
    targetRef: containerRef,
    baseWidth: BASE_WIDTH,
    baseHeight: BASE_HEIGHT,
  });

  return (
    <div
      ref={containerRef}
      style={scaleStyle}
      className="bg-background overflow-hidden shadow-2xl rounded-3xl flex flex-col will-change-transform"
    >
      {header && <header className="flex-shrink-0">{header}</header>}
      <main className="flex-1 overflow-y-auto overscroll-contain">{main}</main>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
});
