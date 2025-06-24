'use client';
import { Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface FamilyModeToggleProps {
  familyMode: boolean;
  setFamilyMode: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
}

// 스켈레톤 컴포넌트
export function FamilyModeToggleSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-6 w-11 rounded-full" />
    </div>
  );
}

export default function FamilyModeToggle({
  familyMode,
  setFamilyMode,
  isLoading = false,
}: FamilyModeToggleProps) {
  if (isLoading) {
    return <FamilyModeToggleSkeleton />;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
        <div className="grid gap-1.5">
          <Label
            htmlFor="family-mode"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            가족 모드
          </Label>
          <p className="text-xs text-muted-foreground">가족 정보를 바탕으로 추천받기</p>
        </div>
      </div>
      <Switch id="family-mode" checked={familyMode} onCheckedChange={setFamilyMode} />
    </div>
  );
}
