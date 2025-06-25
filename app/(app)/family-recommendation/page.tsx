'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Sparkles,
  Phone,
  Zap,
  Tv,
  Gift,
} from 'lucide-react';
import { toast } from 'sonner';
import { useFamily } from '@/hooks/family';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layouts/page-layout';

export default function FamilyRecommendationPage() {
  const router = useRouter();
  const { family, dashboard, isLoading, error } = useFamily();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // 추천 요금제 데이터 (실제로는 API에서 가져와야 함)
  const recommendedPlans = [
    {
      id: '5g-premier-essential',
      name: '5G 프리미어 에센셜',
      description: '무제한 데이터와 프리미엄 혜택',
      price: '월 95,000원',
      originalPrice: 105000,
      discountedPrice: 89000,
      color: 'blue',
      isRecommended: true,
      benefits: [
        '데이터 무제한',
        '음성통화 무제한',
        '유튜브 프리미엄 무료',
        '디즈니+ 무료',
        '넷플릭스 스탠다드 무료',
      ],
      features: [
        { icon: Zap, text: '5G 초고속 무제한' },
        { icon: Phone, text: '음성통화 무제한' },
        { icon: Tv, text: 'OTT 3개 서비스 무료' },
        { icon: Gift, text: '추가 혜택 다수' },
      ],
    },
    {
      id: '5g-data-regular',
      name: '5G 데이터 레귤러',
      description: '넉넉한 데이터와 무제한 통화',
      price: '월 63,000원',
      originalPrice: 70000,
      discountedPrice: 57000,
      color: 'emerald',
      isRecommended: false,
      benefits: [
        '데이터 50GB',
        '음성통화 무제한',
        '문자메시지 기본제공',
        '부가통화 300분',
        '속도제어 1Mbps',
      ],
      features: [
        { icon: Zap, text: '5G 50GB + 1Mbps' },
        { icon: Phone, text: '음성통화 무제한' },
        { icon: Gift, text: '부가통화 300분' },
      ],
    },
    {
      id: '5g-light-plus',
      name: '5G 라이트+',
      description: '가볍게 시작하는 5G 라이프',
      price: '월 55,000원',
      originalPrice: 60000,
      discountedPrice: 49000,
      color: 'emerald',
      isRecommended: false,
      benefits: [
        '데이터 14GB',
        '음성통화 무제한',
        '문자메시지 기본제공',
        '부가통화 300분',
        '속도제어 1Mbps',
      ],
      features: [
        { icon: Zap, text: '5G 14GB + 1Mbps' },
        { icon: Phone, text: '음성통화 무제한' },
        { icon: Gift, text: '부가통화 300분' },
      ],
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error('가족 정보를 불러오는데 실패했습니다.');
      router.push('/family-space');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <PageLayout variant="white" maxWidth="xl" padding="lg">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#388E3C] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">추천 정보를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!family || !dashboard) {
    return (
      <PageLayout variant="white" maxWidth="xl" padding="lg">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">가족 정보를 찾을 수 없습니다.</p>
            <Button
              onClick={() => router.push('/family-space')}
              className="mt-4 bg-[#388E3C] hover:bg-[#2E7D32] text-white"
            >
              가족 스페이스로 돌아가기
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const discount = dashboard.discount;

  const header = (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>돌아가기</span>
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#388E3C]">가족 요금제 추천</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {family.family.name} 가족을 위한 최적 요금제
        </p>
      </div>
      <div className="w-20"></div>
    </div>
  );

  return (
    <PageLayout variant="white" maxWidth="xl" header={header}>
      <div className="p-6 space-y-8">
        {/* 할인 혜택 요약 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-[#388E3C] to-[#81C784] text-white border-0 rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-bold">가족 결합 할인 혜택</h2>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  추천
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-2xl font-bold">{discount.formattedMonthlyDiscount}</span>
                  </div>
                  <p className="text-sm text-green-100">월 절약 금액</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {discount.yearlyDiscount.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-sm text-green-100">연간 절약 금액</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-5 h-5" />
                    <span className="text-2xl font-bold">{discount.memberCount}명</span>
                  </div>
                  <p className="text-sm text-green-100">적용 구성원</p>
                </div>
              </div>

              <p className="text-sm text-center text-green-100 leading-relaxed">
                {discount.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 추천 요금제 목록 */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">추천 요금제</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {family.family.name} 가족에게 최적화된 요금제를 선택해보세요
            </p>
          </div>

          <div className="space-y-4">
            {recommendedPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    plan.isRecommended
                      ? 'border-[#81C784] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  } ${selectedPlan === plan.id ? 'ring-2 ring-[#388E3C]' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                          {plan.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.description}
                        </p>
                      </div>
                      {plan.isRecommended && (
                        <Badge className="bg-[#81C784] text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          추천
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* 가격 정보 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            월 {plan.originalPrice.toLocaleString()}원
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            -
                            {(
                              ((plan.originalPrice - plan.discountedPrice) / plan.originalPrice) *
                              100
                            ).toFixed(0)}
                            %
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-[#388E3C]">
                          월 {plan.discountedPrice.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          가족 결합 할인 적용가
                        </div>
                      </div>
                    </div>

                    {/* 주요 기능 */}
                    <div className="grid grid-cols-2 gap-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <feature.icon className="w-4 h-4 text-[#388E3C]" />
                          <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* 혜택 목록 */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        포함 혜택
                      </p>
                      <div className="space-y-1">
                        {plan.benefits.slice(0, 3).map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-[#388E3C] rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                          </div>
                        ))}
                        {plan.benefits.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{plan.benefits.length - 3}개 혜택 더
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
