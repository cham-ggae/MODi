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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap, Heart } from "lucide-react";
import { useGetSurveyResult } from "@/hooks/use-survey-result";
import { bugNameUiMap } from "@/types/survey.type";
import { SurveyResultResponse } from "@/types/survey.type";
import { planDetails, userTypes, typeImageMap } from "@/lib/survey-result-data";
import { useInView } from "react-intersection-observer";
import { parseBenefitString, getBenefitIcon, transformBenefitTextToHtml } from "@/lib/survey-utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

// bugId에 따른 추천 이유 매핑
const getRecommendationReason = (bugId: number): string => {
  switch (bugId) {
    case 1: // 호박벌형
      return "출퇴근길 유튜브·릴스 루틴이 필수라면?<br/>무제한 데이터에 유튜브/디즈니+ 혜택까지!<br/>스트리밍족을 위한 완벽한 조합이에요🍯";
    case 2: // 무당벌레형
      return "하루 통화량이 많다면 무제한 음성통화는 기본!<br/>50GB/14GB 데이터로 메시지도 걱정 없이.<br/>통화가 일상인 당신에게 꼭 맞는 요금제예요☎️";
    case 3: // 라바형 (기존 개미형)
      return "매달 요금 걱정된다면?<br/>데이터·통화 기본은 챙기고,<br/>월 4~5만 원대 실속형 요금제 조합이에요💸";
    case 4: // 나비형
      return "유튜브, 넷플릭스, 디즈니+까지?!<br/>최대 4개 OTT 중 택1 무료 제공!<br/>혜택 다 챙기고 싶은 당신을 위한 프리미엄 선택🦋";
    case 5: // 장수풍뎅이형 (가족형)
      return "가족 전체의 통신비를 챙겨야 한다면?<br/>무제한 통화·데이터에 넷플릭스·디즈니 혜택까지!<br/>든든하게 챙길 수 있는 대표 요금제 조합이에요🛡️";
    default:
      return "당신에게 최적화된 요금제를 추천해드려요!";
  }
};

export default function SurveyResultContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAnimatedBenefit, setHasAnimatedBenefit] = useState(false);
  const [hasAnimatedPlan, setHasAnimatedPlan] = useState(false);
  const [isFamilyBenefitOpen, setIsFamilyBenefitOpen] = useState(false);
  const [isAdditionalDiscountOpen, setIsAdditionalDiscountOpen] = useState(false);

  // URL에서 bugId 가져오기
  const searchParams = useSearchParams();
  const bugId = searchParams.get("bugId") ? parseInt(searchParams.get("bugId")!) : null;

  const {
    data: surveyResult,
    isLoading,
    isError,
  } = useGetSurveyResult(bugId!, { enabled: !!bugId });

  // react-intersection-observer 사용
  const { ref: benefitRef, inView: benefitInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const { ref: planRef, inView: planInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // 📍 [디버깅] API 응답 데이터 확인용 console.log 추가
  useEffect(() => {
    if (surveyResult) {
      console.log("🔍 API 응답(surveyResult):", surveyResult);
      console.log("🔍 혜택 정보(benefit):", surveyResult.benefit);
    }
  }, [surveyResult]);

  // 애니메이션 상태 관리
  useEffect(() => {
    if (benefitInView && !hasAnimatedBenefit) {
      setHasAnimatedBenefit(true);
    }
  }, [benefitInView, hasAnimatedBenefit]);

  useEffect(() => {
    if (planInView && !hasAnimatedPlan) {
      setHasAnimatedPlan(true);
    }
  }, [planInView, hasAnimatedPlan]);

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
    description: userType.description,
    message: userType.message,
    recommendations: [
      planDetails[surveyResult.suggest1]?.name,
      planDetails[surveyResult.suggest2]?.name,
    ].filter(Boolean) as string[],
  };

  // bugId에 따른 추천 이유 가져오기
  const recommendationReason = getRecommendationReason(bugId);

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
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">{finalUserType.type}</h1>
        </div>

        <Card className="mb-20 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-emerald-700 text-center">
              {finalUserType.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-left whitespace-pre-wrap leading-relaxed font-medium px-2">
              {finalUserType.description}
            </p>
          </CardContent>
        </Card>

        <div className="text-center mb-20 px-4">
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            "{finalUserType.message}"
          </p>
        </div>

        <div
          className={`transition-all duration-1000 ease-out text-center ${
            currentStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="animate-bounce mb-4">
            <ChevronDown className="w-8 h-8 text-emerald-500 mx-auto" />
          </div>
          <p className="text-emerald-600 font-medium mb-6">나에게 맞는 요금제는?</p>
        </div>
      </div>

      <div
        ref={benefitRef}
        className={`transition-all duration-700 ease-out max-w-md mx-auto ${
          hasAnimatedBenefit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-sm p-6 shadow-md mb-10">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            ✨ 이런 이유로 이 요금제를 추천했어요!
          </h2>
          <div className="text-center">
            <p
              className="text-gray-700 text-lg leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: recommendationReason }}
            />
          </div>
        </div>
      </div>

      <div
        ref={planRef}
        className={`transition-all duration-700 ease-out ${
          hasAnimatedPlan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="bg-white p-6 pb-12">
          <div className="max-w-md mx-auto space-y-4">
            {[surveyResult.suggest1, surveyResult.suggest2].map((planId, index) => {
              if (!planId || !planDetails[planId]) return null;
              const plan = planDetails[planId];
              const isFirstPlan = index === 0;

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
                      className={`w-full font-semibold py-3 rounded-xl shadow-lg ${
                        isFirstPlan
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                          : "bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      }`}
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

      {bugId === 5 && (
        <div className="bg-white pb-12">
          {/* 가족 결합 혜택 안내 토글 */}
          <Collapsible
            open={isFamilyBenefitOpen}
            onOpenChange={setIsFamilyBenefitOpen}
            className="border-t border-[#eaeaea]"
          >
            <div className="max-w-md mx-auto px-6">
              <CollapsibleTrigger className="w-full flex justify-between items-center py-5">
                <h3 className="text-sm font-semibold text-gray-500">가족 결합 혜택 안내</h3>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isFamilyBenefitOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="bg-[#f8f8f8]">
              <div className="max-w-md mx-auto px-6 py-6 text-left">
                <div className="space-y-2 text-sm text-gray-800">
                  <p>
                    📌 1인당 <strong> 최대 20,000원 </strong> 아낄 수 있어요!
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>
                      2명: <strong>1인당 10,000원 할인</strong>
                    </li>
                    <li>
                      3명: <strong>1인당 14,000원 할인</strong>
                    </li>
                    <li>
                      4~5명: <strong>1인당 20,000원 할인</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 추가 할인도 있어요 토글 */}
          <Collapsible
            open={isAdditionalDiscountOpen}
            onOpenChange={setIsAdditionalDiscountOpen}
            className="border-t border-b border-[#eaeaea]"
          >
            <div className="max-w-md mx-auto px-6">
              <CollapsibleTrigger className="w-full flex justify-between items-center py-5">
                <h4 className="text-sm font-semibold text-gray-500">🎁 추가 할인도 있어요</h4>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isAdditionalDiscountOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="bg-[#f8f8f8]">
              <div className="max-w-md mx-auto px-6 py-6 text-left">
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
                  <li>
                    청소년 할인: 만 18세 이하 구성원 <strong>월 10,000원 추가 할인</strong>
                  </li>
                  <li>
                    시그니처 가족 할인: <strong>최대 33,000원 할인</strong> (5G 시그니처 이용 시)
                  </li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
