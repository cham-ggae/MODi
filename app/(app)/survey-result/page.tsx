"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap, Heart } from "lucide-react";

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

export default function SurveyResultPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [benefitRef, benefitHasBeenInView] = useInViewOnce(0.2);
  const [planRef, planInView] = useInViewOnce(0.2);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000); // 2초 후 혜택 섹션
    const timer2 = setTimeout(() => setCurrentStep(2), 4000); // 4초 후 요금제 섹션
    const timer3 = setTimeout(() => setIsVisible(true), 1000); // 1초 후 카드 표시

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // 개미형 성격 분석 데이터
  const antTypeData = {
    description: `💰 혜택 보다는 실속임. 결합할수록 이득 따짐.
👨‍👩‍👧‍👦 가족과 같이 쓰지만 서로 뭘 쓰는지 모름.
🤷‍♂️ 누가 요금제 뭐쓰냐하면 "몰라? 아빠가 알걸" 이라고 함.
📱 데이터 부족하면 가족한테 달라고 함.`,
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합", "가족 할인 혜택"],
    message: `
이젠 당신도 한 번쯤 챙겨볼 타이밍.
가족끼리 요금제 공유하고, 새싹도 같이 키워보세요🌱`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Main Result Section */}
      <div className="relative p-6 max-w-md mx-auto">
        {/* Animated Ant Characters */}
        <div className="relative mb-8 text-center">
          <div className="animate-float">
            <Image
              src="/images/ant.png"
              alt="ant"
              width={250}
              height={250}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          {/* Sparkle effects around ants */}
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
          <p className="text-gray-600 text-sm mb-2">내 가족은... 내가 지킨다...</p>
          <h1 className="text-4xl font-bold text-emerald-600 mb-4"> 개미형</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="font-semibold">두명 절약 시 0000원 할인! (최대 0000원 할인)</span>
            <br />
            복잡한 조건 없이 절약의 가능해요
          </p>
        </div>

        {/* Personality Analysis Section - Highlighter Style */}
        <div className="space-y-8 my-12 text-left">
          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-emerald-100 rounded-lg transform -rotate-1"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">✨ 주요 특징</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {antTypeData.description}
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-yellow-100 rounded-lg transform rotate-1"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">💫 장점</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                {antTypeData.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-sky-100 rounded-lg transform -rotate-2"></span>
            <div className="relative bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🌟 조언</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {antTypeData.message}
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
      <div
        ref={benefitRef}
        className={`transition-all duration-1000 ease-out delay-1000 ${
          benefitHasBeenInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
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
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">가족 할인 혜택</h3>
                      <p className="text-gray-600 text-sm">두 명 이상 가입 시 최대 0000원 할인</p>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Plans Section */}
      <div
        ref={planRef}
        className={`transition-all duration-1000 ease-out delay-300 ${
          planInView ? "animate-slide-up opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-white p-6 pb-12">
          <div className="max-w-md mx-auto space-y-4">
            {/* First Plan */}
            <Card className="shadow-lg border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-emerald-600 font-medium mb-1">
                      데이터를 아껴쓰고 스마트하게
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">5G 프리미어 에센셜</h3>
                    <div className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full mt-2">
                      추천
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">월 56000원</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg">
                  선택하기
                </Button>
              </CardContent>
            </Card>

            {/* Second Plan */}
            <Card className="shadow-lg border-2 border-gray-200 hover:border-emerald-200 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      충분한 금액과 음성을 동시에
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">5G 프리미어 플러스</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">월 56000원</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 rounded-xl"
                >
                  선택하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div style={{ height: "200px" }} />
    </div>
  );
}
