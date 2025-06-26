"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RewardHistory } from "@/types/plants.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

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

  const getPlantImage = () => {
    return plantType === "flower" ? "/images/flower5.png" : "/images/tree5.png";
  };

  const getPlantName = () => {
    return plantType === "flower" ? "꽃" : "나무";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl w-[350px] mx-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <SheetHeader>
          {/* <SheetTitle className="text-center text-xl font-bold">
            🎉 축하합니다 🎉
          </SheetTitle> */}
        </SheetHeader>

        <div className="text-center space-y-6 p-4">
          {/* 식물 완성 메시지 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={getPlantImage()}
                alt={`완성된 ${getPlantName()}`}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getPlantName()}이 완전히 성장하였습니다!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
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
              className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
            >
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">🎁 획득한 보상</div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">{rewardData.rewardName}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{rewardData.description}</div>
            </motion.div>
          )}

          {/* 확인 버튼 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleConfirm}
              className="bg-[#5bc236] hover:bg-[#4ca52d] text-white py-2 px-12 text-base font-semibold rounded-xl"
            >
              확인
            </Button>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
