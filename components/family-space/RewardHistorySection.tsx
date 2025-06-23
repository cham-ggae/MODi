"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFamilyRewardHistory } from "@/hooks/plant/useFamilyRewardHistory";
import { useMarkRewardAsUsed } from "@/hooks/plant/useMarkRewardAsUsed";
import { Gift, Calendar, CheckCircle, Package } from "lucide-react";
import { motion } from "framer-motion";
import { RewardHistory } from "@/types/plants.type";
import { toast } from "sonner";

export function RewardHistorySection() {
  const { data: rewards, isLoading, error } = useFamilyRewardHistory();
  const { mutate: markRewardAsUsed, isPending: isMarking } = useMarkRewardAsUsed();
  const [selectedReward, setSelectedReward] = useState<RewardHistory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleRewardClick = (reward: RewardHistory) => {
    setSelectedReward(reward);
    setShowDetailModal(true);
  };

  const handleUseReward = () => {
    if (selectedReward && !selectedReward.used) {
      markRewardAsUsed(selectedReward.id, {
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

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            보상 히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            보상 히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">보상 히스토리를 불러올 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            보상 히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            보상 히스토리 ({rewards.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewards.map((reward, index) => {
              const isUsed = reward.used;
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] ${
                    isUsed
                      ? "opacity-60 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                      : ""
                  }`}
                  onClick={() => handleRewardClick(reward)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{reward.rewardName}</h4>
                        {isUsed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{reward.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(reward.receivedAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {isUsed && (
                        <div className="mt-2 text-sm text-green-600 font-medium">보상완료!</div>
                      )}
                    </div>
                    <div className="text-2xl ml-4">{isUsed ? "📦" : "🎁"}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 보상 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-yellow-500" />
              보상 상세
            </DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-4">{selectedReward.used ? "📦" : "🎁"}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedReward.rewardName}
                </h3>
                <p className="text-gray-600 mb-4">{selectedReward.description}</p>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedReward.receivedAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {selectedReward.used && (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    보상완료!
                  </div>
                )}
              </div>

              {!selectedReward.used && (
                <Button
                  onClick={handleUseReward}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isMarking}
                >
                  {isMarking ? "처리 중..." : "사용완료"}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
