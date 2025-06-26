import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Calendar, Sparkles, UserPlus } from "lucide-react";
import { DiscountInfo } from "@/types/family.type";

interface FamilyRecommendationCardProps {
  // 가족 API 연동을 위한 props
  combiType?: string;
  memberCount?: number;
  membersWithPlan?: number;
  discountInfo?: DiscountInfo;
  onViewRecommendation?: () => void;
}

export function FamilyRecommendationCard({
  combiType,
  memberCount = 0,
  membersWithPlan = 0,
  discountInfo,
  onViewRecommendation,
}: FamilyRecommendationCardProps) {
  // 가족이 2명 미만인 경우 - 가족 초대 안내
  if (memberCount < 2) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">가족 결합 요금제</h2>
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-600"
            >
              초대 필요
            </Badge>
          </div>

          <div className="text-center py-6">
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              가족을 초대해보세요!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              가족이 2명 이상 모이면 결합 요금제로
              <br />더 많이 절약할 수 있어요
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 가족이 2명 이상이지만 할인 정보가 없는 경우
  if (!discountInfo || discountInfo.totalMonthly <= 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">가족 결합 요금제</h2>
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600"
            >
              로딩중
            </Badge>
          </div>

          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-sm">결합 요금제 정보를 불러오는 중이에요</p>
            <p className="text-sm">잠시 후 다시 확인해주세요</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">가족 결합 요금제</h2>
          </div>
          <Badge className="bg-gray-50 dark:bg-gray-50 text-gray-600 dark:text-green-300 text-xs px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-300">
            <TrendingUp className="w-3 h-3 mr-1" />
            {memberCount}명 가족
          </Badge>
        </div>

        <div className="space-y-4">
          {/* 결합 상품 정보 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💝</div>
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">
                    {combiType || "가족 결합 상품"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {memberCount}명 구성원이 함께하는 가족
                  </div>
                </div>
              </div>
              <a
                href="https://www.lguplus.com/mobile/combined/together"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ffffff] dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs hover:bg-gray-50 dark:hover:bg-gray-600 shadow-m inline-flex items-center justify-center"
                style={{ minWidth: "64px", textAlign: "center" }}
              >
                상세보기
              </a>
            </div>
          </div>

          {/* 할인 정보 */}
          <div className="space-y-3">
            {/* 월 할인 정보 */}
            <div className="p-4 bg-white-50 dark:bg-green-900/20 rounded-xl border border-gray-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-gray-700 dark:text-gray-200">
                    월{" "}
                    <span className="text-[#5bc236] dark:text-[#81C784]">{discountInfo.formattedMonthlyDiscount}</span>{" "}
                    절약
                  </span>
                </div>
                <Users className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {discountInfo.description}
              </p>
            </div>

            {/* 연간 할인 정보 */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    연간 절약 금액
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                    {discountInfo.yearlyDiscount.toLocaleString()}원
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1년간 총 절약</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
