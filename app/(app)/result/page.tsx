"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, RotateCcw, Heart, Star, Check } from "lucide-react";

interface UserType {
  type: string;
  emoji: string;
  title: string;
  description: string;
  recommendations: string[];
  savings: number;
  message: string;
}

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
    emoji: "🪲",
    title: "내 가족은 내가 지킨다",
    description: "온 가족 통신비를 책임지는 혜택 수호자",
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합"],
    savings: 45000,
    message: "가족이 먼저! 함께 쓰면 더 커지는 할인 혜택을 받아보세요!",
  },
  무당벌레형: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "TMI를 주고 받는게 일상!",
    description: "통화, 문자는 제 삶의 기본값, 연락은 진심이라구요!",
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 20000,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  라바형: {
    type: "라바형",
    emoji: "🐜",
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

export default function PsychologyTestResult() {
  const [isVisible, setIsVisible] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);

  // userType별 이미지 파일명 매핑
  const typeImageMap: Record<string, string> = {
    호박벌형: "/images/bee.png",
    라바형: "/images/larva.png",
    무당벌레형: "/images/ladybug.png",
    개미형: "/images/ant.png",
    나비형: "/images/butterfly.png",
  };

  useEffect(() => {
    // 기존 로직: localStorage에서 결과 타입 불러오기 (surveyResult)
    const savedResult = localStorage.getItem("surveyResult");
    if (savedResult) {
      const result = JSON.parse(savedResult);
      const resultType = result.type as keyof typeof userTypes;
      setUserType(userTypes[resultType] || userTypes["개미형"]);
    } else {
      setUserType(userTypes["개미형"]); // fallback
    }
    setIsVisible(true);
  }, []);

  if (!userType) return null;

  // 이미지 경로 결정
  const imageSrc = typeImageMap[userType.type] || "/butterfly.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with animated image */}
        <div className="text-center pt-8 pb-6">
          <div className="relative inline-block">
            <div className="animate-float">
              <Image
                src={imageSrc}
                alt={userType.type + " 이미지"}
                width={250}
                height={250}
                className="mx-auto drop-shadow-lg"
                priority
              />
            </div>
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 animate-pulse">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            </div>
            <div className="absolute -bottom-1 -left-3 animate-pulse delay-300">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
            </div>
            <div className="absolute top-1 -left-4 animate-pulse delay-700">
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Result Title */}
        <div
          className={`text-center mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">당신의 결과는...</h1>
          <div
            className="
    bg-gradient-to-r     /* 오른쪽으로 그라데이션 */
    from-white           /* 시작은 흰색 */
    to-[#a99292]         /* 끝은 #a99292 */
    text-white
    px-6 py-3
    rounded-full
    text-lg font-semibold
    shadow-lg
  "
          >
            {userType.type}
          </div>
        </div>

        {/* Result Card */}
        <Card
          className={`mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            {/* <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full text-sm font-medium text-emerald-700 mb-4">
                <Heart className="w-4 h-4" />
                성격 분석 결과
              </div>
            </div> */}

            <div className="space-y-4">
              <div className="bg-brown-50 p-4 rounded-xl border-l-4 border-brown-300">
                <h3 className="font-semibold text-gray-800 mb-2">✨ 주요 특징</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{userType.description}</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-300">
                <h3 className="font-semibold text-gray-800 mb-2">💫 장점</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  {userType.recommendations.map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl border-l-4 border-teal-300">
                <h3 className="font-semibold text-gray-800 mb-2">🌟 조언</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{userType.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Recommendation Section */}
        <Card
          className={`mb-6 shadow-xl border-0 bg-gradient-to-r from-green-400 to-emerald-500 text-white transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                추천 요금제
              </div>
              <h3 className="text-xl font-bold mb-2">{userType.type}을 위한 추천 요금제</h3>
              <p className="text-green-100 text-sm">당신에게 딱 맞는 플랜을 추천해드려요!</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">프리미엄 플랜</h4>
                <div className="text-right">
                  <div className="text-2xl font-bold">₩{userType.savings.toLocaleString()}</div>
                  <div className="text-xs text-green-100">월 예상 절약</div>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {userType.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-105">
                지금 시작하기
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-100">7일 무료 체험 • 언제든 취소 가능</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div
          className={`space-y-3 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>

          <Button
            variant="outline"
            className="w-full border-2 border-green-200 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 테스트하기
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-gray-400 text-xs">
            이 결과는 재미를 위한 것이며 과학적 근거는 없습니다 💚
          </p>
        </div>
      </div>
    </div>
  );
}
