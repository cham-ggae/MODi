"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Check, Star, Zap } from "lucide-react";

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

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 500); // 2초 후 혜택 섹션
    const timer2 = setTimeout(() => setCurrentStep(2), 4000); // 4초 후 요금제 섹션

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Main Result Section */}
      <div className="relative p-6 max-w-md mx-auto text-center">
        {/* Animated Ant Characters */}
        <div className="relative mb-8">
          <div className="animate-float">
            <Image
              src="/images/ant.png"
              alt="귀여운 개미 가족"
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
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-2">온 가족통신비 책임지는 혜택 수호자</p>
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">개미형</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            <br />
            <span className="font-semibold">두명 절약 시 0000원 할인! (최대 0000원 할인)</span>
            <br />
            복잡한 조건 없이 절약의 가능해요
          </p>
        </div>

        {/* Scroll Down Arrow - appears after 1.5 seconds */}
        <div
          className={`transition-all duration-100 ${
            currentStep >= 0.1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
        className={`transition-all duration-1000 ease-out delay-500 ${
          benefitHasBeenInView ? "opacity-100" : "opacity-0 animate-slide-up"
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
