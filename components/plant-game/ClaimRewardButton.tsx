"use client";

import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { usePlantGameStore } from '@/store/usePlantGameStore';
import { useClaimReward, usePlantStatus } from '@/hooks/plant';
import confetti from 'canvas-confetti';
import { useFamily } from '@/hooks/family';

export function ClaimRewardButton() {
  const {
    currentLevel,
    handleClaimRewardClick,
    showRewardModal,
  } = usePlantGameStore();
  const { familyId } = useFamily();
  const { mutate: claimReward, isPending: isLoading } = useClaimReward();
  const { data: plantStatus } = usePlantStatus(familyId ?? 0);

  const handleClick = () => {
    handleClaimRewardClick({
      currentLevel,
      claimReward,
      confetti,
    });
  };

  return (
    <div className="px-6 mb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Button
          onClick={handleClick}
          disabled={isLoading || showRewardModal || currentLevel !== 5}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Gift className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "보상 수령 중..." : "보상 수령하기 🎁"}
        </Button>
      </motion.div>
    </div>
  );
}
