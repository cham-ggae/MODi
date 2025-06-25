"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Users, Copy, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFamily } from "@/hooks/family";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function FamilySpaceTutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [isJoiningFamily, setIsJoiningFamily] = useState(false);
  const router = useRouter();
  const { createFamily, joinFamily, hasFamily, isCreating, isJoining, refetch } = useFamily();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isJoiningFamily) return; // 가족 참여 중이면 아무것도 하지 않음
    console.log("[DEBUG] useEffect hasFamily", { hasFamily, isJoinModalOpen });
    if (hasFamily && !isJoinModalOpen) {
      console.log("[DEBUG] useEffect navigating to /family-space");
      router.push("/family-space");
    }
  }, [hasFamily, router, isJoinModalOpen, isJoiningFamily]);

  const tutorialSteps = [
    {
      id: 1,
      title: "함께하는 보람,\n메시지로 남겨요",
      image: "/images/tutorial1.png",
      description: "가족과 소중한 메시지를 주고받으며 추억을 만들어요",
    },
    {
      id: 2,
      title: "요금제 추천도\n가족이 함께",
      image: "/images/tutorial2.png",
      description: "가족 구성원의 성향을 파악해 최적의 요금제를 추천받아요",
    },
    {
      id: 3,
      title: "새싹이 피어나는\n우리 가족 공간",
      image: "/images/tutorial3.png",
      description: "가족과 함께 키우는 식물로 더욱 특별하게",
    },
    {
      id: 4,
      title: "가족 초대는\n언제든 쉽게!",
      image: "/images/tutorial4.png",
      description: "가족을 초대하고 함께 요금제를 관리해보세요",
    },
  ];

  const handleCreateFamily = async () => {
    // 인증 상태 먼저 확인
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/");
      return;
    }

    try {
      // 사용자 닉네임을 가족명으로 사용 (닉네임이 없으면 기본값 사용)
      const familyName = user?.nickname || user?.email?.split("@")[0] || "내 가족";

      console.log("🔍 가족 생성 시도:", {
        hasUser: !!user,
        nickname: user?.nickname,
        email: user?.email,
        familyName,
        isAuthenticated,
      });

      await createFamily({
        name: familyName,
        combiType: "투게더 결합",
      });

      // 성공 후 family-space 페이지로 이동
      router.push("/family-space");
    } catch (error) {
      console.error("가족 스페이스 생성 실패:", error);
      // 에러 토스트는 뮤테이션에서 자동으로 처리됨
    }
  };

  const handleJoinFamily = async () => {
    if (!inviteCode.trim() || inviteCode.trim().length !== 6) {
      setJoinError("6자리 초대 코드를 입력해주세요.");
      return;
    }

    setJoinError("");
    setIsJoiningFamily(true);

    try {
      await joinFamily({ inviteCode: inviteCode.trim().toUpperCase() });
      await refetch();
      router.push("/family-space");

      // ✅ 리다이렉트 직후에는 더 이상 아무것도 하지 않음
      return;
    } catch (error: any) {
      setIsJoiningFamily(false); // 실패 시에만 false
      console.error("가족 참여 실패:", error);
      if (error.response?.status === 400) {
        setJoinError("잘못된 초대 코드입니다. 다시 확인해주세요.");
      } else {
        setJoinError("가족 참여 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("초대 코드가 복사되었습니다! 가족들에게 공유해보세요.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 튜토리얼 완료 후 가족 스페이스 생성
      handleCreateFamily();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // 로딩 중이면 로딩 화면 표시
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">사용자 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 가족 참여 중이면 로딩 화면만 표시
  if (isJoiningFamily) {
    // 모달 강제 닫기
    if (isJoinModalOpen) setIsJoinModalOpen(false);
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">가족 스페이스로 이동 중...</p>
        </div>
      </div>
    );
  }

  const currentTutorial = tutorialSteps[currentStep];

  // 가족명 표시용 (닉네임 → 이메일 앞부분 → 기본값 순서)
  const displayFamilyName = user?.nickname || user?.email?.split("@")[0] || "내";

  return (
    <>
      <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-center p-4 flex-shrink-0 relative">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              {currentStep + 1} / {tutorialSteps.length}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center"
            >
              {/* Image */}
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Image
                      src={currentTutorial.image || "/placeholder.svg"}
                      alt={currentTutorial.title}
                      width={192}
                      height={192}
                      className="object-contain drop-shadow-lg"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Title */}
              <motion.h1
                className="text-xl font-bold text-gray-900 mb-3 leading-tight whitespace-pre-line"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {currentTutorial.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-gray-600 text-sm leading-relaxed px-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {currentTutorial.description}
              </motion.p>

              {/* 가입하기 버튼 - 첫 번째와 마지막 페이지에만 표시 */}
              {(currentStep === 0 || currentStep === tutorialSteps.length - 1) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-6 flex justify-center"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setJoinError(""); // 모달 열 때 에러 초기화
                      setInviteCode(""); // 입력값도 초기화
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    초대 받으셨나요? 입장하기
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mb-6 flex-shrink-0">
          <div className="flex space-x-3">
            {tutorialSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-[#72f343] w-8"
                    : index < currentStep
                    ? "bg-green-300 w-2"
                    : "bg-gray-300 w-2"
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">이전</span>
            </Button>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={isCreating}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5bc236] hover:bg-[#469729] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              <span>
                {currentStep === tutorialSteps.length - 1
                  ? isCreating
                    ? "생성 중..."
                    : `${displayFamilyName} 가족 스페이스 생성`
                  : "다음"}
              </span>
              {currentStep === tutorialSteps.length - 1 ? (
                isCreating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    ⏳
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                )
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 가입하기 모달 */}
      {isJoinModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsJoinModalOpen(false)}
          />
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl p-6 pt-4 pb-8 px-10 flex flex-col items-center"
            style={{ maxWidth: 420, margin: "0 auto" }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setIsJoinModalOpen(false)}
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            {/* Title & Description */}
            <div className="mt-12 mb-6 text-center w-full">
              <div className="text-xl font-bold text-gray-900 mb-8">
                가족 스페이스 입장코드 입력
              </div>
              <div className="text-[13px] text-gray-600 leading-snug mb-5">
                <div>가족 구성원에게 받은 6자리 초대 코드를 입력해주세요.</div>
                <div>초대 코드는 초대한 가족이 알고 있어요.</div>
              </div>
            </div>
            {/* Input */}
            <div className="flex justify-center gap-2 mb-5 w-full">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="------"
                className="w-64 text-center text-3xl font-mono border-b-2 border-gray-300 focus:border-green-500 outline-none py-2 tracking-widest bg-transparent"
                autoFocus
              />
            </div>
            {joinError && (
              <div className="text-red-500 text-sm mt-1 text-center w-full mb-2">{joinError}</div>
            )}
            {/* Buttons */}
            <div className="flex gap-2 mt-8 w-full">
              {/* <button
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => {
                  setIsJoinModalOpen(false);
                  setInviteCode("");
                  setJoinError("");
                }}
              >
                취소
              </button> */}
              <button
                className={`flex-1 py-3 rounded-xl font-semibold transition 
                  ${
                    inviteCode.trim().length === 6 && !isJoining
                      ? "bg-[#5bc236] text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                onClick={handleJoinFamily}
                disabled={isJoining || inviteCode.trim().length !== 6}
              >
                {isJoining ? "참여 중..." : "가족 참여하기"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
