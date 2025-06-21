"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap, Heart } from "lucide-react";
import { useGetSurveyResult } from "@/hooks/use-survey-result";
import { bugNameUiMap } from "@/types/survey.type";
import { SurveyResultResponse } from "@/types/survey.type";

// 📍 데이터 구조 정의
interface UserType {
  type: string;
  emoji: string;
  title: string;
  description: string;
  recommendations: string[];
  savings: number;
  message: string;
}

const planDetails: Record<
  number,
  {
    name: string;
    description: string;
    price: string;
    color: string;
    isRecommended?: boolean;
    link: string;
  }
> = {
  1: {
    name: "5G 프리미어 에센셜",
    description: "데이터와 통화의 필수적인 선택",
    price: "월 85,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409",
  },
  4: {
    name: "5G 프리미어 레귤러",
    description: "미디어 혜택과 데이터의 균형",
    price: "월 95,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433",
  },
  6: {
    name: "5G 데이터 레귤러",
    description: "넉넉한 데이터와 무제한 통화",
    price: "월 63,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783",
  },
  8: {
    name: "5G 라이트+",
    description: "가볍게 시작하는 5G 라이프",
    price: "월 55,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000437",
  },
  10: {
    name: "5G 미니",
    description: "알뜰하고 컴팩트한 5G",
    price: "월 37,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1000325",
  },
  12: {
    name: "5G 슬림+",
    description: "가성비 좋은 슬림한 5G",
    price: "월 47,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000487",
  },
  13: {
    name: "5G 프리미어 플러스",
    description: "다양한 프리미엄 혜택까지",
    price: "월 105,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252",
  },
  37: {
    name: "5G 프리미어 슈퍼",
    description: "최고의 혜택, 슈퍼 프리미엄",
    price: "월 115,000원",
    color: "blue",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205251",
  },
};

const userTypes: Record<string, UserType> = {
  호박벌형: {
    type: "호박벌형",
    emoji: "🐝",
    title: "데이터 쓰는 꿀박형",
    description: "인터넷은 공기 같은 존재, 데이터가 부족하면 진짜 불편해!",
    recommendations: ["5G 프리미어 에센셜", "5G 프리미어 레귤러"],
    savings: 25000,
    message: "꿀벌형인 당신, 멈추지 마세요! 꿀처럼 달콤한 무제한 요금제를 추천해요🍯",
  },
  개미형: {
    type: "개미형",
    emoji: "🐜",
    title: "내 가족은 내가 지킨다",
    description: `💰 혜택 보다는 실속임. 결합할수록 이득 따짐.

👨‍👩‍👧‍👦 가족과 같이 쓰지만 서로 뭘 쓰는지 모름.

🤷‍♂️ 누가 요금제 뭐쓰냐하면 "몰라? 아빠가 알걸" 이라고 함.

📱 데이터 부족하면 가족한테 달라고 함.`,
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합"],
    savings: 45000,
    message: `이젠 당신도 한 번쯤 챙겨볼 타이밍.
가족끼리 요금제 공유하고, 새싹도 같이 키워보세요🌱`,
  },
  무당벌레형: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "TMI를 주고 받는게 일상!",
    description: "통화, 문자는 제 삶의 기본값, 연락은 진심이라구요!",
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 0,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  라바형: {
    type: "라바형",
    emoji: "🐛",
    title: "티끌 모아 태산, 요금도 전략적으로",
    description: "혜택보다 중요한 건 내 지갑 사정. 꼭 필요한 기능만!",
    recommendations: ["유쓰 5G 미니", "유쓰 5G 슬림+"],
    savings: 15000,
    message: "애벌레는 물 한 방울도 아깝지요! 알뜰한 당신에게 꼭 맞는 요금제가 있어요🍃",
  },
  나비형: {
    type: "나비형",
    emoji: "🦋",
    title: "알잘딱깔센 요금 마스터",
    description: "알아서 잘! 딱! 깔끔하고 센스 있게! 멤버십·제휴 할인 골라쓰는 재미~",
    recommendations: ["5G 프리미어 플러스", "U+ 멤버십 결합 상품"],
    savings: 35000,
    message:
      "나비형은 아름답게 혜택을 날개처럼 펼치죠🦋 지금 당신에게 가장 유리한 조건으로 안내할게요!",
  },
};

const typeImageMap: Record<string, string> = {
  호박벌형: "/images/bee.png",
  라바형: "/images/larva.png",
  무당벌레형: "/images/ladybug.png",
  개미형: "/images/ant.png",
  나비형: "/images/butterfly.png",
};

// Intersection Observer Hook
function useInViewOnce(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasBeenInView(true);
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

const parseBenefitString = (benefitString: string): Array<{ title: string; content: string }> => {
  if (!benefitString) return [];
  const benefits: Array<{ title: string; content: string }> = [];
  const regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g;
  let match;
  while ((match = regex.exec(benefitString)) !== null) {
    benefits.push({ title: match[1].trim(), content: match[2].trim() });
  }
  return benefits;
};

const getBenefitIcon = (title: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    음성통화: <Check className="w-3 h-3 text-white" />,
    문자메시지: <Zap className="w-3 h-3 text-white" />,
    기본혜택: <Star className="w-3 h-3 text-white" />,
  };
  return iconMap[title] || <Check className="w-3 h-3 text-white" />;
};

export default function SurveyResultContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [benefitRef, benefitHasBeenInView] = useInViewOnce(0.2);
  const [planRef, planInView] = useInViewOnce(0.2);

  // 📍 [수정] URL에서 bugId 가져오기
  const searchParams = useSearchParams();
  const bugId = searchParams.get("bugId") ? parseInt(searchParams.get("bugId")!) : null;

  const {
    data: surveyResult,
    isLoading,
    isError,
  } = useGetSurveyResult(bugId!, { enabled: !!bugId });

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (isError || !bugId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {isError ? "오류가 발생했습니다" : "잘못된 접근입니다"}
        </h2>
        <p className="text-gray-600">
          {isError ? "결과를 불러오는 데 실패했습니다." : "올바른 경로로 접근해주세요."}
        </p>
      </div>
    );
  }

  // isLoading은 Suspense의 fallback으로 처리되므로, surveyResult가 아직 없을 때 로딩 처리
  if (!surveyResult) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const displayName = bugNameUiMap[surveyResult.bugName] || "개미형";
  const userType = userTypes[displayName];
  const imageSrc = typeImageMap[displayName] || "/images/butterfly.png";

  const finalUserType = {
    ...userType,
    description: surveyResult.feature || userType.description,
    message: surveyResult.personality || userType.message,
    recommendations: [
      planDetails[surveyResult.suggest1]?.name,
      planDetails[surveyResult.suggest2]?.name,
    ].filter(Boolean) as string[],
  };

  const parsedBenefits = parseBenefitString(surveyResult.benefit || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="relative p-6 max-w-md mx-auto">
        <div className="relative mb-8 text-center">
          <div className="animate-float">
            <Image
              src={imageSrc}
              alt={finalUserType.type}
              width={250}
              height={250}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600 text-sm mb-2">{finalUserType.title}</p>
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">{finalUserType.type}</h1>
          {finalUserType.savings > 0 && (
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold">
                월 최대 {finalUserType.savings.toLocaleString()}원 절약 가능!
              </span>
            </p>
          )}
        </div>

        <div
          className={`transition-all duration-1000 ease-out text-center ${
            currentStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="animate-bounce mb-4">
            <ChevronDown className="w-8 h-8 text-emerald-500 mx-auto" />
          </div>
          <p className="text-emerald-600 font-medium mb-6">혜택확인하기</p>
        </div>
      </div>

      <div
        ref={benefitRef}
        className={`transition-all duration-1000 ease-out delay-2000 opacity-100 translate-y-0`}
      >
        <div className="bg-white/80 backdrop-blur-sm p-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              이런 혜택이 있어요!
            </h2>
            <Card className="mb-6 shadow-lg border-0 bg-gray-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {parsedBenefits.length > 0 ? (
                    parsedBenefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getBenefitIcon(benefit.title)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                          <p className="text-gray-600 text-sm">{benefit.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center">추천 혜택을 준비 중입니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div
        ref={planRef}
        className="transition-all duration-1000 ease-out delay-300 opacity-100 translate-y-0"
      >
        <div className="bg-white p-6 pb-12">
          <div className="max-w-md mx-auto space-y-4">
            {[surveyResult.suggest1, surveyResult.suggest2].map((planId) => {
              if (!planId || !planDetails[planId]) return null;
              const plan = planDetails[planId];
              return (
                <Card
                  key={plan.name}
                  className="shadow-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div
                          className={`text-xs ${
                            plan.color === "emerald" ? "text-emerald-600" : "text-blue-600"
                          } font-medium mb-1`}
                        >
                          {plan.description}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                        {plan.isRecommended && (
                          <div className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mt-2">
                            추천
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{plan.price}</div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                      onClick={() => window.open(plan.link, "_blank")}
                    >
                      요금제 자세히 보기
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
