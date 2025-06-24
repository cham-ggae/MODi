"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFamilyRewardHistory } from "@/hooks/plant/useFamilyRewardHistory";
import { useMarkRewardAsUsed } from "@/hooks/plant/useMarkRewardAsUsed";
import { Gift, Calendar, CheckCircle, Package, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RewardHistory } from "@/types/plants.type";
import { toast } from "sonner";

export function RewardHistorySection() {
  const { data: rewards, isLoading, error } = useFamilyRewardHistory();
  const { mutate: markRewardAsUsed, isPending: isMarking } = useMarkRewardAsUsed();
  const [selectedReward, setSelectedReward] = useState<RewardHistory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleRewardClick = (reward: RewardHistory) => {
    setSelectedReward(reward);
    setShowDetailModal(true);
  };

  const handleUseReward = () => {
    if (selectedReward && !selectedReward.used) {
      markRewardAsUsed(selectedReward.rewardLogId, {
        onSuccess: () => {
          setShowDetailModal(false);
          toast.success(`${selectedReward.rewardName} 보상을 사용완료 처리했습니다! 🎉`);
        },
        onError: () => {
          toast.error("보상 사용완료 처리에 실패했습니다. 다시 시도해주세요.");
        },
      });
    }
  };

  const displayedRewards = showAll ? rewards : rewards?.slice(0, 1);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">보상 히스토리</h2>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">보상 히스토리를 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">보상 히스토리</h2>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">보상 히스토리를 불러올 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">보상 히스토리</h2>
            </div>
          </div>
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">아직 받은 보상이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">식물을 완성하면 보상을 받을 수 있어요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">보상 히스토리</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {rewards.length}개의 보상을 받았어요
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {displayedRewards?.map((reward, index) => {
                const isUsed = reward.used;
                return (
                  <motion.div
                    key={reward.rewardLogId}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`transition-shadow dark:bg-gray-700 ${
                        isUsed
                          ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-600"
                          : "cursor-pointer hover:shadow-md"
                      }`}
                      onClick={() => !isUsed && handleRewardClick(reward)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift
                            className={`w-5 h-5 ${isUsed ? "text-gray-400" : "text-yellow-500"}`}
                          />
                          <h3
                            className={`font-semibold flex-1 ${
                              isUsed
                                ? "text-gray-500 dark:text-gray-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {reward.rewardName}
                          </h3>
                          {isUsed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <p
                          className={`text-sm mb-2 ${
                            isUsed
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {reward.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(reward.receivedAt).toLocaleDateString("ko-KR")}
                          </div>
                          <div className="text-2xl">{isUsed ? "📦" : "🎁"}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {rewards.length > 1 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-500 hover:bg-transparent hover:text-yellow-600 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-yellow-400"
              >
                <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 mr-1" />
                </motion.div>
                {showAll ? "숨기기" : `최근 보상 ${rewards.length - 1}개 더보기`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 보상 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {selectedReward && (
            <div className="bg-white dark:bg-gray-800">
              {/* 기프티콘 헤더 */}
              <div className="bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-6 text-center relative">
                <div className="text-4xl mb-2">{selectedReward.used ? "📦" : "🎁"}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {selectedReward.rewardName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {selectedReward.description}
                </p>
              </div>

              {/* 기프티콘 바디 */}
              <div className="p-6">
                {/* 바코드 영역 */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 text-center shadow-sm">
                  <div className="text-xs text-gray-500 mb-2">바코드</div>
                  <div className="flex justify-center items-center space-x-1 mb-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-8 w-1 ${
                          Math.random() > 0.5
                            ? "bg-black dark:bg-white"
                            : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {selectedReward.rewardLogId.toString().padStart(8, "0")}
                  </div>
                </div>

                {/* 보상 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 dark:text-gray-400">발급일</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(selectedReward.receivedAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 dark:text-gray-400">발급시간</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(selectedReward.receivedAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                    <span className="text-sm text-gray-600 dark:text-gray-400">상태</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedReward.used
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {selectedReward.used ? "사용완료" : "사용가능"}
                    </span>
                  </div>
                </div>

                {/* 사용완료 표시 */}
                {selectedReward.used && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center shadow-sm">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">보상 사용이 완료되었습니다!</span>
                    </div>
                  </div>
                )}

                {/* 사용완료 버튼 */}
                {!selectedReward.used && (
                  <div className="mt-6">
                    <Button
                      onClick={handleUseReward}
                      className="w-full bg-gradient-to-b from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-gray-800 dark:text-white font-medium py-3 rounded-lg   dark:border-gray-600"
                      disabled={isMarking}
                    >
                      {isMarking ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-white"></div>
                          처리 중...
                        </div>
                      ) : (
                        "보상 사용하기"
                      )}
                    </Button>
                  </div>
                )}

                {/* 사용 안내 */}
                {!selectedReward.used && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      사용하기 버튼을 누르면 보상이 사용완료 처리됩니다
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
