import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface FamilyRecommendationCardProps {
  // 가족 API 연동을 위한 props
  combiType?: string;
  memberCount?: number;
  membersWithPlan?: number;
  discountInfo?: {
    totalMonthly: number;
    description: string;
    memberCount: number;
  };
  onViewRecommendation?: () => void;
}

export function FamilyRecommendationCard({
  combiType,
  memberCount = 0,
  membersWithPlan = 0,
  discountInfo,
  onViewRecommendation,
}: FamilyRecommendationCardProps) {
  // 추천이 있는지 확인 (요금제를 가입한 구성원이 있고, 할인 정보가 있는 경우)
  const hasRecommendation = membersWithPlan > 0 && discountInfo && discountInfo.totalMonthly > 0;

  if (!hasRecommendation) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">요금제 추천</h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-sm">요금제를 가입한 가족 구성원이 있어야</p>
            <p className="text-sm">추천을 받을 수 있어요</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            추천 받은 결합 하러 가기
          </h2>
          <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">
            <TrendingUp className="w-3 h-3 mr-1" />
            추천
          </Badge>
        </div>

        <div className="space-y-4">
          {/* 결합 상품 정보 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💝</div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {combiType || '가족 결합 상품'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {memberCount}명 구성원 • {membersWithPlan}명 요금제 가입
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onViewRecommendation}
              className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-full"
            >
              이동
            </Button>
          </div>

          {/* 할인 정보 */}
          {discountInfo && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-300">
                    월 {discountInfo.totalMonthly.toLocaleString()}원 절약
                  </span>
                </div>
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                {discountInfo.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
