'use client'
import { Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import React, { useState } from 'react';

const FamilyModeToggle = () => {
  const [familyMode, setFamilyMode] = useState(false);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            가족 결합 집중 모드
          </span>
        </div>
        <Switch
          checked={familyMode}
          onCheckedChange={setFamilyMode}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
      {familyMode && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
          가족 요금제 결합에 특화된 상담을 제공합니다
        </p>
      )}
    </div>
  );
};

export default FamilyModeToggle;