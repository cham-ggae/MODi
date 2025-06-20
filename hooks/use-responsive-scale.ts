'use client';

import { useState, useLayoutEffect, RefObject } from 'react';

interface ResponsiveScaleOptions {
  targetRef: RefObject<HTMLElement>;
  baseWidth: number;
  baseHeight: number;
}

/**
 * 뷰포트 크기에 따라 요소의 스케일을 동적으로 조절하는 커스텀 훅
 * @param targetRef - 스케일을 적용할 요소의 ref
 * @param baseWidth - 기준 너비
 * @param baseHeight - 기준 높이
 */
export function useResponsiveScale({ targetRef, baseWidth, baseHeight }: ResponsiveScaleOptions) {
  const [style, setStyle] = useState({});

  useLayoutEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement) return;

    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 너비와 높이 비율을 계산하여 더 작은 쪽을 기준으로 스케일 결정
      const scaleX = viewportWidth / baseWidth;
      const scaleY = viewportHeight / baseHeight;
      const scale = Math.min(scaleX, scaleY);

      setStyle({
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      });
    };

    handleResize(); // 초기 렌더링 시 스케일 계산
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [targetRef, baseWidth, baseHeight]);

  return style;
}
