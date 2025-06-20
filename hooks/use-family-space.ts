'use client';

import { useState, useEffect } from 'react';

export function useFamilySpaceStatus() {
  const [hasFamilySpace, setHasFamilySpace] = useState<boolean>(true);

  const createFamilySpace = () => {
    localStorage.setItem('hasFamilySpace', 'true');
    // 기본 가족 구성원 생성
    const defaultFamily = [
      { id: '1', name: '엄마', plan: 'LTE 무제한 요금제', usage: '23GB', avatar: '🐛' },
      { id: '2', name: '아빠', plan: '5G 프리미엄 요금제', usage: '45GB', avatar: '👤' },
      { id: '3', name: '나', plan: '5G 슈퍼 요금제', usage: '67GB', avatar: '🐞' },
    ];
    localStorage.setItem('familyMembers', JSON.stringify(defaultFamily));
    setHasFamilySpace(true);
  };

  return {
    hasFamilySpace,
    createFamilySpace,
    isLoading: false,
  };
}
