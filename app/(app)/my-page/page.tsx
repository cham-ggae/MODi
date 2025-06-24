"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Calendar,
  TrendingUp,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { authenticatedApiClient } from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { planDetails } from "@/lib/survey-result-data";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { mypageApi } from "@/lib/api/mypage";

interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
  userType: string;
  joinDate: string;
  lastSurveyDate: string;
  completedMissions: number;
  familyMembers: number;
  bugId?: number;
}

interface PlanCard {
  planId: number;
  planName: string;
  price?: number;
  discountPrice?: number;
}

interface HistoryItem {
  type: string;
  description: string;
  recommendedPlan: string;
  date: string;
}

type SurveyResult = PlanCard | HistoryItem;

function isPlanCard(item: SurveyResult): item is PlanCard {
  return (
    typeof (item as PlanCard).planId === "number" && typeof (item as PlanCard).planName === "string"
  );
}

function isHistoryItem(item: SurveyResult): item is HistoryItem {
  return (
    typeof (item as HistoryItem).type === "string" &&
    typeof (item as HistoryItem).description === "string"
  );
}

// bugId별 이미지 매핑
const bugIdToImage: Record<number, string> = {
  1: "/images/bee.png", // 호박벌형
  2: "/images/ladybug.png", // 무당벌레형
  3: "/images/larva.png", // 라바형
  4: "/images/butterfly.png", // 나비형
  5: "/images/ant.png", // 개미형(장수풍뎅이)
};

// bugId별 이름 매핑
const bugIdToName: Record<number, string> = {
  1: "호박벌형",
  2: "무당벌레형",
  3: "라바형",
  4: "나비형",
  5: "개미형",
};

// bugId별 특징 데이터 매핑
const bugIdToFeatureMap: Record<number, { title: string; features: string[] }> = {
  1: {
    title: "데이터와 통화의 필수적인 선택",
    features: [
      "🍯 출퇴근길 유튜브·릴스 루틴이 필수라면?",
      "🎬 무제한 데이터에 유튜브/디즈니+ 혜택까지!",
      "📱 스트리밍족을 위한 완벽한 조합이에요",
    ],
  },
  2: {
    title: "통화가 일상인 당신에게 꼭 맞는 요금제예요",
    features: [
      "☎️ 하루 통화량이 많다면 무제한 음성통화는 기본!",
      "💬 50GB/14GB 데이터로 메시지도 걱정 없이.",
      "📞 통화가 일상인 당신에게 꼭 맞는 요금제예요",
    ],
  },
  3: {
    title: "혜택도 좋지만.. 요금부터 봅시다",
    features: [
      "🪙 이벤트, 할인, 결합 쓸 수 있는 건 다 써봄.",
      "💸 가격 먼저 보고 혜택은 보너스로 생각함.",
      "🧾 청구서 보고 '이번달도 잘 막았다'는 뿌듯함 느끼는 타입",
    ],
  },
  4: {
    title: "멤버십, 제휴 할인 그래서 뭐가 있죠?",
    features: [
      "🎁 제휴 혜택, 멤버십 적립 다 외우고 다님.",
      "💡 '이거 포인트 적립돼요?' 입에 달고 다님.",
      "🛍️ 혜택 보자마자 '어머 이건 사야 돼' 모드 돌입",
    ],
  },
  5: {
    title: "가족 요금제? 아빠만 아는 비밀",
    features: [
      "👨‍👩‍👧‍👦 가족과 같이 쓰지만 서로 뭘 쓰는지 모름.",
      "🧑‍💼 누가 요금제 뭐쓰냐하면 '몰라? 아빠가 알걸' 이라고 함.",
      "📱 데이터 부족하면 가족한테 달라고 함.",
    ],
  },
};

export default function MyPage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recommendHistory, setRecommendHistory] = useState<SurveyResult[]>([]);
  const [recommendHistoryList, setRecommendHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { accessToken } = useAuthStore.getState();
      console.log("accessToken:", accessToken);
      try {
        const res = await authenticatedApiClient.get("/mypage", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(res.data.userInfo);
        setRecommendHistory(res.data.recommendHistory || []);
      } catch (e) {
        setUserInfo(null);
        setRecommendHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">로딩 중...</div>;
  }

  // userInfo가 없으면 카카오 프로필/이름만 보여줌
  if (!userInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">마이페이지</h1>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={userInfo?.profileImage || "/images/modi.png"}
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {userInfo?.name || user?.nickname || "이름 없음"}
            </div>
            <div className="text-gray-500 dark:text-gray-400">설문조사 내역이 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  // bugId가 있으면 곤충 캐릭터 이미지, 없으면 프로필 이미지
  const profileImgSrc =
    userInfo.bugId && bugIdToImage[userInfo.bugId]
      ? bugIdToImage[userInfo.bugId]
      : userInfo.profileImage || "/images/modi.png";

  return (
    <div className="h-full flex flex-col">
      {/* Header - 고정, 맨 위 */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">마이페이지</h1>
        <ThemeToggle />
      </div>
      {/* Family-style Recommendation Card Section (상단) */}
      <div className="px-6 pt-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* <h2 className="text-lg font-bold text-gray-900 dark:text-white">나의 통신 캐릭터</h2> */}
            {/* <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              추천
            </Badge> */}
          </div>
          {/* Centered Image + Name + bugName */}
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <img
                src={profileImgSrc}
                alt="프로필 이미지"
                className="h-20"
                style={{ maxWidth: "80px", objectFit: "contain" }}
              />
            </motion.div>
            <div className="font-bold text-lg text-gray-900 dark:text-white mt-2">
              {userInfo.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {userInfo.bugId ? bugIdToName[userInfo.bugId] : userInfo.userType}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-6">
          {/* User Profile Card
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0"></Card> */}

          {/* User Info Details */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="pb-4 px-6">
              {userInfo.bugId ? (
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {bugIdToFeatureMap[userInfo.bugId]?.title || "유형 정보"}
                  </h3>
                  <div className="bg-blue-50 rounded-xl px-4 py-3 w-full text-left max-w-sm space-y-2">
                    {bugIdToFeatureMap[userInfo.bugId]?.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-gray-800 leading-relaxed flex items-start"
                      >
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    통신 성향 파악하기
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    아직 통신 성향을 파악하지 못했어요😭
                  </p>
                  <button
                    className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                    onClick={() => {
                      window.location.href = "/survey";
                    }}
                  >
                    통신성향파악하기
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards → 추천 요금제 카드 (가로 슬라이드) */}
          <div className="mb-2 mt-6">
            <p className="text-lg font-bold text-gray-900">추천 요금제</p>
          </div>
          <Swiper
            modules={[Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="!pb-8"
          >
            {recommendHistory && recommendHistory.filter(isPlanCard).length > 0 ? (
              recommendHistory.filter(isPlanCard).map((plan, idx) => {
                const isRecommended = idx === 0;
                return (
                  <SwiperSlide key={plan.planId}>
                    <div className="w-full min-h-[260px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col justify-between transition-colors duration-200 hover:bg-blue-500 hover:text-white group">
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium group-hover:text-blue-100">
                            {plan.description || ""}
                          </span>
                          {isRecommended && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold group-hover:bg-white group-hover:text-blue-500">
                              추천
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900 group-hover:text-white">
                          {plan.planName}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white">
                        {plan.price ? `월 ${plan.price.toLocaleString()}원` : ""}
                      </div>
                      <a
                        href={plan.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          "block w-full border border-blue-500 text-blue-500 text-center rounded-lg py-2 font-semibold transition hover:bg-white hover:text-blue-500 group-hover:bg-white group-hover:text-blue-500"
                        }
                      >
                        요금제 자세히 보기
                      </a>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <SwiperSlide>
                <div className="w-full min-h-[260px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col justify-between">
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-gray-600 dark:text-gray-400 text-sm text-center w-full">
                      추천 요금제 정보가 없습니다.
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Survey Results History */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  지난 요금제 추천 기록
                </h3>
                {/* <FileText className="w-5 h-5 text-gray-400" /> */}
              </div>
              <div className="space-y-3">
                {recommendHistory.filter(isHistoryItem).map((result, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                        {result.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{result.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {result.description}
                    </p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      추천: {result.recommendedPlan}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <div className="space-y-3">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/settings"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">설정</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        알림, 개인정보 설정
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/notifications"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">알림</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">푸시 알림 관리</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-0">
                <Link
                  href="/help"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">도움말</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">자주 묻는 질문</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* App Info */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-2xl">🌱</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                모디 (MODI)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">버전 1.0.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
