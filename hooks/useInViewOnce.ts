"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 요소가 뷰포트에 한 번이라도 나타났는지 여부를 추적하는 커스텀 훅.
 * @param {number} threshold - Intersection Observer의 threshold 값 (0.0 ~ 1.0)
 * @returns {[React.RefObject<T>, boolean]} - 감시할 요소에 부착할 ref와 뷰포트 노출 여부(boolean)
 */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [inView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true);
          // 한 번 감지된 후에는 observer를 중단하여 불필요한 감지를 방지합니다.
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      // 컴포넌트 언마운트 시 observer 연결을 해제합니다.
      observer.disconnect();
    };
  }, [ref, threshold, inView]); // ref를 의존성 배열에 추가

  return [ref, inView] as const;
}
