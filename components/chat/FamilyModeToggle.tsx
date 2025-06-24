'use client';
import { Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FamilyModeToggleProps {
  familyMode: boolean;
  setFamilyMode: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
  hasFamily?: boolean;
  memberCount?: number;
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
  hasFamily = false,
  memberCount = 0,
}: FamilyModeToggleProps) {
  const router = useRouter();

  if (isLoading) {
    return <FamilyModeToggleSkeleton />;
  }

  // 가족 모드 사용 가능 여부 확인
  const canUseFamilyMode = hasFamily && memberCount > 1;

  // 비활성화 상태일 때 설명 텍스트
  const getDescriptionText = () => {
    if (!hasFamily) {
      return '가족 스페이스에 참여하면 사용할 수 있어요';
    }
    if (memberCount <= 1) {
      return '가족 구성원이 2명 이상일 때 사용할 수 있어요';
    }
    return '가족 정보를 바탕으로 추천받기';
  };

  // 토글 클릭 핸들러
  const handleToggleChange = (checked: boolean) => {
    if (!canUseFamilyMode) {
      if (!hasFamily) {
        // 가족이 없는 경우
        toast.error('가족을 생성하세요!', {
          description: '가족 스페이스에서 가족을 만들고 초대해보세요.',
          action: {
            label: '가족 생성하기',
            onClick: () => router.push('/family-space-tutorial'),
          },
        });
      } else if (memberCount <= 1) {
        // 가족은 있지만 1명인 경우
        toast.error('가족을 더 초대해보세요!', {
          description: '가족 구성원이 2명 이상일 때 가족 모드를 사용할 수 있어요.',
          action: {
            label: '가족 초대하기',
            onClick: () => router.push('/family-space'),
          },
        });
      }
      return;
    }

    // 가족 모드 사용 가능한 경우
    setFamilyMode(checked);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Users
          className={`h-5 w-5 ${
            canUseFamilyMode
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        />
        <div className="grid gap-1.5">
          <Label
            htmlFor="family-mode"
            className={`text-sm font-medium leading-none ${
              canUseFamilyMode
                ? 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                : 'text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            가족 모드
            {memberCount > 0 && (
              <span className="ml-1 text-xs text-gray-400">({memberCount}명)</span>
            )}
          </Label>
          <p
            className={`text-xs ${
              canUseFamilyMode ? 'text-muted-foreground' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {getDescriptionText()}
          </p>
        </div>
      </div>
      <Switch
        id="family-mode"
        checked={familyMode && canUseFamilyMode}
        onCheckedChange={handleToggleChange}
        disabled={false} // 클릭 가능하게 유지하여 토스트 메시지 표시
      />
    </div>
  );
}
