"use client";

/**

<설문조사 결과 페이지 컴포넌트>

URL 쿼리에서 bugId를 받아 사용자 유형 결과 조회

bugId에 해당하는 사용자 유형 정보 및 추천 요금제 표시

Intersection Observer를 통해 단계적 애니메이션 출력

추천 요금제 클릭 시 외부 상세 페이지로 이동

사용 Hook:

useGetSurveyResult: 설문 결과 API 조회

useInViewOnce: 컴포넌트 뷰포트 진입 시 1회 렌더 트리거

주요 UI 요소:

사용자 유형 캐릭터 + 설명

추천 혜택 리스트

추천 요금제 카드 리스트
*/

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap, Heart } from "lucide-react";
import { useGetSurveyResult } from "@/hooks/use-survey-result";
import { bugNameUiMap } from "@/types/survey.type";
import { SurveyResultResponse } from "@/types/survey.type";
import { planDetails, userTypes, typeImageMap } from "@/lib/survey-result-data";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { parseBenefitString, getBenefitIcon } from "@/lib/survey-utils";

export default function SurveyResultContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [benefitRef, benefitHasBeenInView] = useInViewOnce<HTMLDivElement>(0.2);
  const [planRef, planInView] = useInViewOnce<HTMLDivElement>(0.2);

  // URL에서 bugId 가져오기
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
