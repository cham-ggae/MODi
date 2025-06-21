"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap, Heart } from "lucide-react";
import { useGetSurveyResult } from "@/hooks/use-survey-result";
import { typeToBugId } from "@/types/survey.type";

// 📍 [1단계] 데이터 구조 정의 및 추가
interface UserType {
  type: string;
  emoji: string;
  title: string;
  description: string;
  recommendations: string[];
  savings: number;
  message: string;
}

// 📍 [수정] 요금제 ID를 이름으로 변환하는 매핑 추가
const planIdToName: Record<number, string> = {
  1: "5G 프리미어 에센셜",
  4: "5G 프리미어 레귤러",
  6: "5G 데이터 레귤러",
  8: "5G 라이트+",
  10: "5G 미니",
  12: "5G 슬림+",
  13: "5G 프리미어 플러스",
  37: "5G 프리미어 슈퍼",
};

// 📍 [추가] 요금제 상세 정보 매핑
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

// 📍 [수정] 요금제 ID 배열을 이름 배열로 변환하는 함수
const convertPlanIdsToNames = (suggest1: number, suggest2: number): string[] => {
  const names: string[] = [];
  if (planIdToName[suggest1]) names.push(planIdToName[suggest1]);
  if (planIdToName[suggest2]) names.push(planIdToName[suggest2]);
  return names.length > 0 ? names : ["추천 요금제를 준비 중입니다"];
};

const userTypes: Record<string, UserType> = {
  호박벌: {
    type: "호박벌형",
    emoji: "🐝",
    title: "데이터 쓰는 꿀박형",
    description: "인터넷은 공기 같은 존재, 데이터가 부족하면 진짜 불편해!",
    recommendations: ["5G 프리미어 에센셜", "5G 프리미어 레귤러"],
    savings: 25000,
    message: "꿀벌형인 당신, 멈추지 마세요! 꿀처럼 달콤한 무제한 요금제를 추천해요🍯",
  },
  개미: {
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
  무당벌레: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "TMI를 주고 받는게 일상!",
    description: "통화, 문자는 제 삶의 기본값, 연락은 진심이라구요!",
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 0,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  라바: {
    type: "라바형",
    emoji: "🐛",
    title: "티끌 모아 태산, 요금도 전략적으로",
    description: "혜택보다 중요한 건 내 지갑 사정. 꼭 필요한 기능만!",
    recommendations: ["유쓰 5G 미니", "유쓰 5G 슬림+"],
    savings: 15000,
    message: "애벌레는 물 한 방울도 아깝지요! 알뜰한 당신에게 꼭 맞는 요금제가 있어요🍃",
  },
  나비: {
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
  호박벌: "/images/bee.png",
  라바: "/images/larva.png",
  무당벌레: "/images/ladybug.png",
  개미: "/images/ant.png",
  나비: "/images/butterfly.png",
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

// 📍 [추가] benefit 문자열 파싱 함수
const parseBenefitString = (benefitString: string): Array<{ title: string; content: string }> => {
  console.log("🔍 파싱 시작 - 원본 문자열:", benefitString);

  if (!benefitString) {
    console.log("❌ benefitString이 비어있음");
    return [];
  }

  const benefits: Array<{ title: string; content: string }> = [];

  // <h3>태그로 제목을 찾고, 그 다음 <p>태그의 내용을 가져오는 정규식
  const regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g;
  let match;

  while ((match = regex.exec(benefitString)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();

    console.log("✅ 파싱된 항목:", { title, content });

    benefits.push({
      title,
      content,
    });
  }

  console.log("📊 최종 파싱 결과:", benefits);
  return benefits;
};

// 📍 [추가] benefit 아이콘 매핑
const getBenefitIcon = (title: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    음성통화: <Check className="w-3 h-3 text-white" />,
    문자메시지: <Zap className="w-3 h-3 text-white" />,
    기본혜택: <Star className="w-3 h-3 text-white" />,
    데이터: <Zap className="w-3 h-3 text-white" />,
    가족할인: <Heart className="w-3 h-3 text-white" />,
  };

  return iconMap[title] || <Check className="w-3 h-3 text-white" />;
};

export default function SurveyResultPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [benefitRef, benefitHasBeenInView] = useInViewOnce(0.2);
  const [planRef, planInView] = useInViewOnce(0.2);

  // 📍 [2단계] localStorage에서 bugId 가져오기
  const [bugId, setBugId] = useState<number | null>(null);

  useEffect(() => {
    // localStorage에서 surveyResult 읽어오기
    const surveyResultStr = localStorage.getItem("surveyResult");
    if (surveyResultStr) {
      try {
        const surveyResult = JSON.parse(surveyResultStr);
        const bugIdFromType = typeToBugId[surveyResult.type] || 1;
        setBugId(bugIdFromType);
      } catch (error) {
        console.error("localStorage 파싱 오류:", error);
        setBugId(1); // 기본값
      }
    } else {
      setBugId(1); // 기본값
    }
  }, []);

  const {
    data: surveyResult,
    isLoading,
    isError,
  } = useGetSurveyResult(bugId || 1, { enabled: !!bugId });

  console.log("s1", typeof surveyResult?.suggest1);
  console.log("s2", typeof surveyResult?.suggest2);
  console.log("✅ planDetails keys:", Object.keys(planDetails));
  console.log(
    "✅ planDetails[suggest1]:",
    surveyResult?.suggest1
      ? planDetails[surveyResult.suggest1 as keyof typeof planDetails]
      : undefined
  );

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // 📍 [3단계] 로딩 및 에러 상태 처리
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  if (isError || !surveyResult)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600">결과를 불러오는 데 실패했습니다.</p>
      </div>
    );

  // 📍 [디버깅] API 응답 구조 확인
  console.log("🔍 API 응답 전체:", surveyResult);
  console.log("🔍 suggest1:", surveyResult.suggest1);
  console.log("🔍 suggest2:", surveyResult.suggest2);
  console.log("🔍 benefit 필드 존재 여부:", !!surveyResult.benefit);
  console.log("🔍 benefit 필드 값:", surveyResult.benefit);

  // 📍 [테스트] benefit 파싱 테스트용 데이터
  const testBenefitString = `
    <h3>음성통화</h3>
    <p>집/이동전화 무제한(+부가통화 300분)</p>

    <h3>문자메시지</h3>
    <p>기본제공</p>

    <h3>기본혜택</h3>
    <p>U+ 모바일tv 기본 월정액 무료</p>
  `;

  console.log("🧪 테스트 benefit 파싱:", parseBenefitString(testBenefitString));

  // 📍 [정규식 테스트] 정규식이 올바르게 작동하는지 확인
  const regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g;
  const testMatches = [...testBenefitString.matchAll(regex)];
  console.log("🔍 정규식 테스트 결과:", testMatches);

  // 📍 [수정] 데이터 조회 로직 개선
  const bugNameFromApi = surveyResult.bugName;
  const validBugName = userTypes[bugNameFromApi] ? bugNameFromApi : "개미";

  const userType = userTypes[validBugName];
  const imageSrc = typeImageMap[validBugName] || "/images/butterfly.png";

  // 📍 [수정] suggest1, suggest2를 사용하여 추천 요금제 생성
  const apiRecommendations = convertPlanIdsToNames(surveyResult.suggest1, surveyResult.suggest2);

  const finalUserType = {
    ...userType,
    description: surveyResult.feature || userType.description,
    message: surveyResult.personality || userType.message,
    recommendations: apiRecommendations,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Main Result Section */}
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
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-4 animate-pulse">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
          </div>
          <div className="absolute -bottom-2 -left-4 animate-pulse delay-500">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
          </div>
          <div className="absolute top-4 -left-6 animate-pulse delay-1000">
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Result Title */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 text-sm mb-2">{finalUserType.title}</p>
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">{finalUserType.type}</h1>
          {/* 절약 혜택 문구 표시 (모든 유형에 적용) */}
          {finalUserType.savings > 0 && (
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold">
                월 최대 {finalUserType.savings.toLocaleString()}원 절약 가능!
              </span>
              <br />
              {finalUserType.type === "개미형"
                ? "복잡한 조건 없이 두명만 모여도 절약돼요"
                : "추천 요금제로 변경하고 혜택을 받으세요"}
            </p>
          )}
        </div>

        {/* Personality Analysis Section - Highlighter Style */}
        <div className="space-y-8 my-12 text-left">
          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-emerald-100 rounded-lg transform -rotate-1"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">✨ 주요 특징</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {finalUserType.description}
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-yellow-100 rounded-lg transform rotate-1"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">💫 추천 요금제</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                {finalUserType.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-sky-100 rounded-lg transform -rotate-2"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🌟 추천 메시지</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {finalUserType.message}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow - appears after 1.5 seconds */}
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

      {/* Benefits Section */}
      {/* <div
        ref={benefitRef}
        className={`transition-all duration-1000 ease-out delay-1000 ${
          benefitHasBeenInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      > */}
      <div
        ref={benefitRef}
        className={`transition-all duration-1000 ease-out delay-2000 opacity-100 translate-y-0`}
      >
        <div className="bg-white/80 backdrop-blur-sm p-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              이런 혜택이 있어요!
            </h2>

            {/* Benefits Card */}
            <Card className="mb-6 shadow-lg border-0 bg-gray-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {surveyResult.benefit || testBenefitString ? (
                    (() => {
                      const benefitData = surveyResult.benefit || testBenefitString;
                      console.log("🎯 실제 benefit 데이터:", benefitData);
                      const parsedBenefits = parseBenefitString(benefitData);
                      console.log("🎯 파싱된 benefit 데이터:", parsedBenefits);
                      console.log("🎯 렌더링할 항목 수:", parsedBenefits.length);

                      if (parsedBenefits.length === 0) {
                        console.log("⚠️ 파싱된 항목이 없음 - 기본 혜택 표시");
                        return null;
                      }

                      return parsedBenefits.map((benefit, idx) => {
                        console.log(`🎯 렌더링 중: ${idx}번째 항목`, benefit);
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getBenefitIcon(benefit.title)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                              <p className="text-gray-600 text-sm">{benefit.content}</p>
                            </div>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    // 기본 혜택 표시 (benefit 데이터가 없는 경우)
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">가족 할인 혜택</h3>
                          <p className="text-gray-600 text-sm">
                            두 명 이상 가입 시 최대 0000원 할인
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">데이터 무제한</h3>
                          <p className="text-gray-600 text-sm">속도 제한 없는 진짜 무제한 데이터</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">복잡한 조건 없음</h3>
                          <p className="text-gray-600 text-sm">간단하고 명확한 요금제</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Plans Section */}
      {/* <div
        ref={planRef}
        className={`transition-all duration-1000 ease-out delay-300 ${
          planInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      > */}
      <div
        ref={planRef}
        className="transition-all duration-1000 ease-out delay-300 opacity-100 translate-y-0"
      >
        <div className="bg-white p-6 pb-12">
          <div className="max-w-md mx-auto space-y-4">
            {/* First Plan - suggest1 */}
            {surveyResult.suggest1 &&
              planDetails[surveyResult.suggest1 as keyof typeof planDetails] && (
                <Card className="shadow-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div
                          className={`text-xs ${
                            planDetails[surveyResult.suggest1 as keyof typeof planDetails].color ===
                            "emerald"
                              ? "text-emerald-600"
                              : "text-blue-600"
                          } font-medium mb-1`}
                        >
                          {
                            planDetails[surveyResult.suggest1 as keyof typeof planDetails]
                              .description
                          }
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {planDetails[surveyResult.suggest1 as keyof typeof planDetails].name}
                        </h3>
                        {planDetails[surveyResult.suggest1 as keyof typeof planDetails]
                          .isRecommended && (
                          <div className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mt-2">
                            추천
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {planDetails[surveyResult.suggest1 as keyof typeof planDetails].price}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                      onClick={() =>
                        window.open(
                          planDetails[surveyResult.suggest1 as keyof typeof planDetails].link,
                          "_blank"
                        )
                      }
                    >
                      요금제 자세히 보기
                    </Button>
                  </CardContent>
                </Card>
              )}

            {/* Second Plan - suggest2 */}
            {surveyResult.suggest2 &&
              planDetails[surveyResult.suggest2 as keyof typeof planDetails] && (
                <Card className="shadow-lg border-2 border-gray-200 hover:border-emerald-200 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div
                          className={`text-xs ${
                            planDetails[surveyResult.suggest2 as keyof typeof planDetails].color ===
                            "emerald"
                              ? "text-emerald-600"
                              : "text-blue-600"
                          } font-medium mb-1`}
                        >
                          {
                            planDetails[surveyResult.suggest2 as keyof typeof planDetails]
                              .description
                          }
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {planDetails[surveyResult.suggest2 as keyof typeof planDetails].name}
                        </h3>
                        {planDetails[surveyResult.suggest2 as keyof typeof planDetails]
                          .isRecommended && (
                          <div className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mt-2">
                            추천
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {planDetails[surveyResult.suggest2 as keyof typeof planDetails].price}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 rounded-xl"
                      onClick={() =>
                        window.open(
                          planDetails[surveyResult.suggest2 as keyof typeof planDetails].link,
                          "_blank"
                        )
                      }
                    >
                      요금제 자세히 보기
                    </Button>
                  </CardContent>
                </Card>
              )}

            {/* Fallback - 요금제 정보가 없는 경우 */}
            {(!surveyResult.suggest1 ||
              !planDetails[surveyResult.suggest1 as keyof typeof planDetails]) &&
              (!surveyResult.suggest2 ||
                !planDetails[surveyResult.suggest2 as keyof typeof planDetails]) && (
                <Card className="shadow-lg border-2 border-gray-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-600">추천 요금제를 준비 중입니다...</p>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>

      <div style={{ height: "200px" }} />
    </div>
  );
}
