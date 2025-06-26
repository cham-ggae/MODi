"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { authenticatedApiClient } from "@/lib/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { planDetails, userTypes } from "@/lib/survey-result-data";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { mypageApi } from "@/lib/api/mypage";
import { useRouter } from "next/navigation";
import { familyApi } from "@/lib/api/family";
import { LeaveFamilyModal } from "@/components/family-space/LeaveFamilyModal";
import { FullScreenLoading } from "@/components/ui/loading";

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
  fid?: number;
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

// bugId별 userTypes key 매핑
const bugIdToUserTypeKey: Record<number, string> = {
  1: "호박벌형",
  2: "무당벌레형",
  3: "라바형",
  4: "나비형",
  5: "개미형",
};

export default function MyPage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recommendHistory, setRecommendHistory] = useState<SurveyResult[]>([]);
  const [recommendHistoryList, setRecommendHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(2);
  const [showCount, setShowCount] = useState(3);
  const router = useRouter();
  const [familyId, setFamilyId] = useState<number | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

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

  useEffect(() => {
    async function fetchHistory() {
      try {
        const rawHistory = await mypageApi.getHistory();
        console.log("히스토리 API 응답:", rawHistory);

        // 프론트에서 매핑 처리
        const processed = rawHistory
          .map((item: any) => ({
            planId: item.planId,
            planName: item.planName,
            price: item.price,
            discountPrice: item.discountPrice,
            link: item.link,
            benefit: item.benefit,
            createdAt: item.createdAt,
          }))
          .sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        console.log("처리된 히스토리:", processed);
        setRecommendHistoryList(processed);
      } catch (e) {
        console.error("히스토리 불러오기 실패:", e);
        setRecommendHistoryList([]);
      }
    }

    fetchHistory();
  }, []);

  useEffect(() => {
    async function fetchFamilyId() {
      try {
        const data = await familyApi.getMyFamily();
        setFamilyId(data?.family?.fid ?? null);
      } catch {
        setFamilyId(null);
      }
    }
    fetchFamilyId();
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  // userInfo가 없으면 카카오 프로필/이름만 보여줌
  if (!userInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
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
    userInfo.bugId !== undefined && bugIdToImage[userInfo.bugId]
      ? bugIdToImage[userInfo.bugId]
      : userInfo.profileImage || "/images/modi.png";

  // userInfo.bugId가 없으면 히스토리 숨김
  const displayRecommendHistoryList = userInfo.bugId ? recommendHistoryList : [];
  const handleLeaveFamily = async () => {
    if (!familyId) {
      alert("가족 ID를 찾을 수 없습니다.");
      return;
    }
    setShowLeaveModal(true);
  };

  const handleLeaveFamilyConfirm = async () => {
    if (typeof familyId !== "number") {
      alert("가족 ID를 찾을 수 없습니다.");
      return;
    }
    try {
      await familyApi.leaveFamily(familyId);
      // 성공 시 튜토리얼로 이동
      window.location.href = "/family-space-tutorial";
    } catch (e) {
      console.error("가족 탈퇴 실패:", e instanceof Error ? e.message : String(e));
      alert("가족스페이스 탈퇴에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // Helper function to render text with bold quotes
  const renderTextWithBoldQuotes = (text: string) => {
    const parts = text.split(/"([^"]*)"/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is text inside quotes - make it bold
        return (
          <span key={index} className="font-bold">
            {part}
          </span>
        );
      }
      // This is regular text
      return part;
    });
  };

  return (
    <div className="h-full lex flex-col">
      {/* Header - 고정, 맨  */}
      <div className="bg-white dark:bg-gray-800 px-3 py-4 flex items-center justify-between flex-shrnk-0">
        {/* <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full transition"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button> */}
        <div />
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
            {userInfo.bugId !== undefined && bugIdToImage[userInfo.bugId] ? (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <img
                  src={profileImgSrc}
                  alt="프로필 이미지"
                  className="h-24"
                  style={{ maxWidth: "96px", objectFit: "contain" }}
                />
              </motion.div>
            ) : (
              <img
                src={profileImgSrc}
                alt="프로필 이미지"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-white"
              />
            )}
            <div className="font-bold text-lg text-gray-900 dark:text-white mt-2">
              {userInfo.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {userInfo.bugId ? bugIdToName[userInfo.bugId] : userInfo.userType}
            </div>
            {/* Personality Traits Badges - moved here */}
            {(() => {
              const badgeMap = {
                1: ["영상 헤비유저", "데이터형", "스트리밍형"],
                2: ["통화중심형", "전화매니아", "연결지향형"],
                3: ["가성비최고", "알뜰소비형", "요금절약형"],
                4: ["혜택러버", "구독혜택형", "멤버십형"],
                5: ["가족 의존형", "절약형", "실용형"],
              };
              const badges = badgeMap[userInfo.bugId as keyof typeof badgeMap] || [];
              const badgeColors = [
                "bg-blue-100 text-blue-800 hover:bg-blue-200",
                "bg-green-100 text-green-800 hover:bg-green-200",
                "bg-purple-100 text-purple-800 hover:bg-purple-200",
              ];
              const badgeIcons = [
                <Users className="w-3 h-3 mr-1" key="icon1" />,
                <Shield className="w-3 h-3 mr-1" key="icon2" />,
                <Zap className="w-3 h-3 mr-1" key="icon3" />,
              ];
              return (
                <div className="flex flex-wrap gap-1 mt-0.5 mb-1 justify-end">
                  {badges.map((label: string, idx: number) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className={
                        badgeColors[idx % badgeColors.length] + " text-[11px] px-1.5 py-0.5 h-6"
                      }
                    >
                      {badgeIcons[idx % badgeIcons.length]}
                      {label}
                    </Badge>
                  ))}
                </div>
              );
            })()}
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
                <div className="flex flex-col items-center text-center w-full min-h-[260px]">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    "
                    {renderTextWithBoldQuotes(
                      userTypes[bugIdToUserTypeKey[userInfo.bugId]]?.title || "유형 정보"
                    )}
                    "
                  </h3>
                  <div className="bg-blue-50 rounded-xl px-6 py-5 w-full mb-2 min-h-[220px] flex flex-col justify-center space-y-2">
                    {userTypes[bugIdToUserTypeKey[userInfo.bugId]]?.description
                      .split("\n")
                      .map((feature: string, idx: number) => (
                        <div
                          key={idx}
                          className="text-m text-gray-800 text-center leading-relaxed flex items-start mb-2"
                        >
                          <span>{renderTextWithBoldQuotes(feature)}</span>
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
                    <div className="w-full min-h-[260px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col justify-between transition-all duration-200 hover:border-2 hover:border-blue-500 group">
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">
                            {plan.description || ""}
                          </span>
                          {isRecommended && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                              추천
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-bold text-gray-900">{plan.planName}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        {plan.price ? `월 ${plan.price.toLocaleString()}원` : ""}
                      </div>
                      <a
                        href={plan.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full border border-blue-500 text-blue-500 text-center rounded-lg py-2 font-semibold transition hover:bg-blue-500 hover:text-white"
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
              </div>
              <div className="space-y-3">
                {displayRecommendHistoryList.length > 0 ? (
                  <>
                    {displayRecommendHistoryList
                      .slice(0, showCount)
                      .map((plan: any, idx: number) => (
                        <div
                          key={`${plan.planId}-${idx}`}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-2"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                              {plan.planName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {plan.createdAt
                                ? new Date(plan.createdAt).toLocaleDateString("ko-KR")
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              월 {plan.discountPrice?.toLocaleString()}원
                            </span>
                            <a
                              href={plan.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 underline ml-2"
                            >
                              자세히
                            </a>
                          </div>
                        </div>
                      ))}
                    <div className="flex justify-center mt-2">
                      {showCount < displayRecommendHistoryList.length ? (
                        <Button
                          variant="ghost"
                          onClick={() => setShowCount((prev) => prev + 3)}
                          className="text-sm text-black-300 hover:bg-transparent hover:text-blue-500 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-green-400"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          추천 요금제 {Math.min(3, displayRecommendHistoryList.length - showCount)}
                          개 더보기
                        </Button>
                      ) : displayRecommendHistoryList.length > 3 &&
                        showCount >= displayRecommendHistoryList.length ? (
                        <Button
                          variant="ghost"
                          onClick={() => setShowCount(3)}
                          className="text-sm text-gray-500 hover:bg-transparent hover:text-green-600 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-green-400"
                        >
                          <ChevronDown
                            className="w-4 h-4 mr-1"
                            style={{ transform: "rotate(180deg)" }}
                          />
                          숨기기
                        </Button>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    추천 기록이 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img src="/images/modi.png" alt="MODI 마스코트" className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                모디 (MODI)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">버전 1.0.0</p>
            </CardContent>
          </Card>

          {/* 가족스페이스 나가기 - width 맞춤 */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
            <CardContent className="px-6 py-2">
              <button
                className="w-full py-3 text-red-500 font-semibold  border-gray-200"
                onClick={handleLeaveFamily}
              >
                가족 스페이스 탈퇴하기
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
      <LeaveFamilyModal
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveFamilyConfirm}
      />
    </div>
  );
}
