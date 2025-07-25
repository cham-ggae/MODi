"use client";

import React from "react";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/layouts/mobile-header";
import { ResponsiveWrapper } from "@/components/responsive-wrapper";
import { BottomNav } from "@/components/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const showHeader = !pathname.startsWith("/plant-game");
  const showFooter = !pathname.startsWith("/plant-game") && !pathname.startsWith("/basic-info");

  const header = <MobileHeader title="MODi" leftAction={<MobileNav />} />;
  const main = children;
  const footer = <BottomNav />;

  if (isMobile) {
    // 모바일 뷰: flexbox 기반 레이아웃으로 안정화, 헤더 제거
    return (
      <div className="h-full w-full flex flex-col bg-background">
        <main className="flex-1 overflow-y-auto">{main}</main>
        {showFooter && <footer className="flex-shrink-0">{footer}</footer>}
      </div>
    );
  }

  // 데스크톱 뷰: ResponsiveWrapper 사용
  return <ResponsiveWrapper header={header} main={main} footer={showFooter ? footer : null} />;
}
