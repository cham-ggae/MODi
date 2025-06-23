"use client";

import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ClaimRewardButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ClaimRewardButton({
  onClick,
  disabled = false,
  isLoading = false,
}: ClaimRewardButtonProps) {
  return (
    <div className="px-6 mb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Button
          onClick={onClick}
          disabled={disabled || isLoading}
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
