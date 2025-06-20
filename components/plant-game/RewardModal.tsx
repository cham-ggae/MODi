"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RewardHistory } from "@/types/plants.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantType: "flower" | "tree";
  rewardData?: RewardHistory;
}

export function RewardModal({ isOpen, onClose, plantType, rewardData }: RewardModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onClose();
    // 가족 스페이스로 이동
    router.push("/family-space");
  };

  const getPlantEmoji = () => {
    return plantType === "flower" ? "🌸" : "🌳";
  };

  const getPlantName = () => {
    return plantType === "flower" ? "꽃" : "나무";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-600">
            🎉 축하합니다!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6 p-4">
          {/* 식물 완성 메시지 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-6xl">{getPlantEmoji()}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getPlantName()}이 완전히 성장하였습니다!
            </h3>
            <p className="text-gray-600">
              가족과 함께 키운 {getPlantName()}이 완성되었어요.
              <br />
              보상을 수령해주세요!
            </p>
          </motion.div>

          {/* 보상 정보 */}
          {rewardData && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="text-yellow-600 font-semibold mb-2">🎁 획득한 보상</div>
              <div className="text-gray-900 font-medium">{rewardData.rewardName}</div>
              <div className="text-gray-600 text-sm mt-1">{rewardData.description}</div>
            </motion.div>
          )}

          {/* 확인 버튼 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={handleConfirm}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
            >
              확인
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
