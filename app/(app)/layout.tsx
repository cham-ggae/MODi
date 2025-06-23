'use client';

import { MobileHeader } from '@/components/layouts/mobile-header';
import { BottomNav } from '@/components/bottom-nav';
import { ResponsiveWrapper } from '@/components/responsive-wrapper';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  const header = <MobileHeader title="MODi" leftAction={null} />;
  const main = children;
  const footer = <BottomNav />;

  if (isMobile) {
    // 모바일 뷰
    return (
      <div className="h-full w-full flex flex-col bg-background max-w-md mx-auto">
        <header className="flex-shrink-0">{header}</header>
        <main className="flex-1 overflow-y-auto">{main}</main>
        <footer className="flex-shrink-0">{footer}</footer>
      </div>
    );
  }

  // 데스크톱 뷰
  return <ResponsiveWrapper header={header} main={main} footer={footer} />;
}
