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

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, X, ArrowLeft } from "lucide-react";
import { useGetSurveyResult } from "@/hooks/use-survey-result";
import { bugNameUiMap } from "@/types/survey.type";
import { planDetails, userTypes, typeImageMap, bugIdToNameMap } from "@/lib/survey-result-data";
import { useInView } from "react-intersection-observer";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFamily } from "@/hooks/family";

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
      return "가족 전체의 통신비를 챙겨야 한다면?<br/>무제한 통화·데이터에 넷플릭스·디즈니 혜택!<br/>든든하게 챙길 수 있는 대표 요금제 조합!";
    default:
      return "당신에게 최적화된 요금제를 추천해드려요!";
  }
};

export default function SurveyResultContent() {
  const router = useRouter();
  const { hasFamily } = useFamily();
  const [hasAnimatedBenefit, setHasAnimatedBenefit] = useState(false);
  const [isFamilyBenefitOpen, setIsFamilyBenefitOpen] = useState(false);
  const [isAdditionalDiscountOpen, setIsAdditionalDiscountOpen] = useState(false);
  const [isSproutInfoOpen, setIsSproutInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL에서 bugId 가져오기
  const searchParams = useSearchParams();
  const bugId = searchParams.get("bugId") ? Number.parseInt(searchParams.get("bugId")!) : null;

  const {
    data: surveyResult,
    isLoading,
    isError,
  } = useGetSurveyResult(bugId!, { enabled: !!bugId });

  // react-intersection-observer 사용
  const { ref: benefitRef, inView: benefitInView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // 애니메이션 상태 관리
  useEffect(() => {
    if (benefitInView && !hasAnimatedBenefit) {
      setHasAnimatedBenefit(true);
    }
  }, [benefitInView, hasAnimatedBenefit]);

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

  const displayName = bugIdToNameMap[bugId] || "개미형";
  const userType = userTypes[displayName];
  const imageSrc = typeImageMap[displayName] || "/images/ant.png";

  const finalUserType = {
    ...userType,
    description: userType.description,
    message: userType.message,
    recommendations: [
      planDetails[surveyResult.suggest1]?.name,
      planDetails[surveyResult.suggest2]?.name,
    ].filter(Boolean) as string[],
  };

  const recommendationReason = getRecommendationReason(bugId);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen w-full">
      <div className="max-w-md mx-auto">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="이전으로 가기"
            className="hover:bg-transparent focus:bg-transparent"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: "#000" }} />
          </Button>
        </div>
        <div className="p-6 pt-0 space-y-6">
          {/* 설문조사 결과 */}
          <div className="space-y-4">
            {/* 캐릭터 이미지 */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={finalUserType.type}
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                  priority
                />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "rgb(62 73 68)" }}>
                {finalUserType.type}
              </h2>
            </div>

            {/* 특성 카드 */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-gray-800 text-center">
                  {finalUserType.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {finalUserType.description.split("\n").map((line, index) => (
                  <p key={index} className="text-gray-700 text-sm leading-relaxed">
                    {line.trim()}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* 메시지 */}
            <div className="text-center py-2 m-8">
              <p className="text-[#6e6e6e] text-m italic m-8">"{finalUserType.message}"</p>
            </div>
          </div>

          {/* 추천 이유 */}
          <div
            ref={benefitRef}
            className={`transition-all duration-700 ease-out ${
              hasAnimatedBenefit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {/* <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✨</span>
                     </div> */}
                      <h3 className="text-base font-bold text-gray-800">이 요금제를 추천해요!</h3>
                    </div>
                    <p
                      className="text-gray-600 text-sm leading-relaxed pl-1"
                      dangerouslySetInnerHTML={{ __html: recommendationReason }}
                    />
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xl">😊</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 가족 결합 혜택 섹션 (bugId === 5일 때만) */}
          {bugId === 5 && (
            <div className="space-y-4">
              <Collapsible
                open={isSproutInfoOpen}
                onOpenChange={setIsSproutInfoOpen}
                className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden"
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 text-lg">🌱</span>
                    <span className="font-semibold text-gray-800">새싹 키우기가 뭔가요?</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isSproutInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-2">함께 키우는 우리 가족 나무🌳</h4>
                      <p className="text-sm text-gray-700 mb-4">
                        가족 스페이스에서 함께 미션을 수행하고 메시지를 나누면 우리만의 특별한
                        나무가 자라나요. 가족과 데이터를 나누고, 함께 소통하며 특별한 보상도
                        얻어보세요!
                      </p>
                      <Button
                        onClick={() => {
                          if (hasFamily) {
                            router.push("/family-space");
                          } else {
                            router.push("/family-space-tutorial");
                          }
                        }}
                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        {hasFamily ? "가족 스페이스로 이동" : "새싹 키우러 가기"}
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isFamilyBenefitOpen}
                onOpenChange={setIsFamilyBenefitOpen}
                className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden"
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 text-lg">👨‍👩‍👧‍👦</span>
                    <span className="font-semibold text-gray-800">가족 결합 혜택 안내</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isFamilyBenefitOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        📌 1인당 <strong className="text-emerald-600">최대 20,000원</strong> 아낄 수
                        있어요!
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>• 2명</span>
                          <strong>1인당 10,000원 할인</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>• 3명</span>
                          <strong>1인당 14,000원 할인</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>• 4~5명</span>
                          <strong>1인당 20,000원 할인</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isAdditionalDiscountOpen}
                onOpenChange={setIsAdditionalDiscountOpen}
                className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden"
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 text-lg">🎁</span>
                    <span className="font-semibold text-gray-800">추가 할인도 있어요</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isAdditionalDiscountOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <div className="bg-orange-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
                      <div>
                        <span>• 청소년 할인: 만 18세 이하 구성원 </span>
                        <strong>월 10,000원 추가 할인</strong>
                      </div>
                      <div>
                        <span>• 시그니처 가족 할인: </span>
                        <strong>최대 33,000원 할인</strong>
                        <span className="text-gray-500"> (5G 시그니처 이용 시)</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* 하단 안내 텍스트 */}
          <div className="text-center pt-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <p className="text-[#6e6e6e] text-sm">추천 요금제 보고 포인트 쌓을 수 있어요 ↓</p>
            </motion.div>
          </div>

          {/* 요금제 추천 보고 포인트 받기 버튼 */}
          <div className="pb-8 mt-0">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full !bg-[#53a2f5] hover:!bg-[#3069a6] text-white py-4 rounded-2xl text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              요금제 추천 보고 포인트 받기
            </Button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-l font-bold text-gray-800">추천 요금제</h3>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-4">
              {/* eslint-disable-next-line no-console */}
              {(() => {
                console.log(
                  "[디버그] suggest1:",
                  surveyResult.suggest1,
                  "suggest2:",
                  surveyResult.suggest2,
                  "planDetails1:",
                  planDetails[surveyResult.suggest1],
                  "planDetails2:",
                  planDetails[surveyResult.suggest2]
                );
                return null;
              })()}
              {[surveyResult.suggest1, surveyResult.suggest2].map((planId, index) => {
                if (!planId || !planDetails[planId]) return null;
                const plan = planDetails[planId];
                const isFirstPlan = index === 0;

                return (
                  <Card
                    key={plan.name}
                    className={`relative bg-white rounded-2xl border-[1px] shadow-sm border-[#cccccc]`}
                  >
                    <CardContent className="p-6">
                      {/* 추천 배지 */}
                      {isFirstPlan && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#53a2f5] text-white text-xs px-3 py-1 rounded-full font-semibold">
                            추천
                          </span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* 헤더 영역 */}
                        <div className="pr-16">
                          <p className="text-xs mb-2 uppercase tracking-wide text-[#5b85b1] font-semibold">
                            {plan.description}
                          </p>
                          <h3 className="text-l font-bold text-gray-900 leading-tight">
                            {plan.name}
                          </h3>
                        </div>

                        {/* 가격 영역 */}
                        <div className="flex justify-between items-end">
                          <div></div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                          </div>
                        </div>

                        {/* 버튼 영역 */}
                        <Button
                          className={`w-full py-3 rounded-xl transition-all duration-300 ${
                            isFirstPlan
                              ? "!bg-[#53a2f5] hover:!bg-[#3069a6] text-white"
                              : "bg-white border-2 border-[#53a2f5] text-[#53a2f5] hover:bg-[#eaf4fd]"
                          }`}
                          onClick={() => window.open(plan.link, "_blank")}
                        >
                          요금제 자세히 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
