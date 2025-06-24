import React, { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import TypingIndicator from "./TypingIndicator";
import WelcomeActionButtons from "./WelcomeActionButtons";
import { useMyUserInfo } from "@/hooks/useUserInfoQuery";
import { ageMockPlanMap } from "@/lib/plan-recommendation-data";
import { PlanRecommendationCard } from "./PlanRecommendationCard";
import type { AdditionalInfoRequest } from "@/lib/api/auth";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AgePlanRecommendationCard from "@/components/chat/AgePlanRecommendationCard";

interface MessageItemProps {
  role: string;
  content: string;
  timestamp: Date;
  cid?: number;
  isSpeaking: boolean;
  ttsSupported: boolean;
  handleSpeakMessage: (text: string, cid?: number) => void;
  id?: string;
}
const MessageItem = ({
  role,
  content,
  timestamp,
  cid,
  isSpeaking,
  ttsSupported,
  handleSpeakMessage,
  id,
}: MessageItemProps) => {
  const { data: user } = useMyUserInfo();

  const isValidAgeGroup = (age: any): age is AdditionalInfoRequest["age"] => {
    return ["10대", "20대", "30대", "40대", "50대 이상"].includes(age);
  };

  const age = user?.age;
  const plans = isValidAgeGroup(age) ? ageMockPlanMap[age] : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${role !== "bot" ? "justify-end" : "justify-start"}`}
      >
        {role === "bot" && (
          <div className="w-10 h-10 mr-3 flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-full">
            <img
              src="/bot-avatar.svg"
              alt="MODI"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        )}
        <div
          className={`max-w-xs px-4 py-3 rounded-2xl ${
            role === "user"
              ? "bg-green-500 text-white rounded-br-md"
              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md prose prose-p:mb-0 prose-sm dark:prose-invert"
          }`}
        >
          {role === "bot" && content === "" ? (
            <TypingIndicator />
          ) : role === "bot" ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm m-0">{content}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <p
              className={`text-xs ${
                role === "user" ? "text-green-100" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {role === "bot" && ttsSupported && (
              <Button
                onClick={() => handleSpeakMessage(content, cid)}
                variant="ghost"
                size="sm"
                className={`p-1 h-auto ml-2 ${
                  !cid
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                }`}
                disabled={!cid}
                title={!cid ? "TTS 준비 중..." : "음성으로 들으기"}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Volume2
                    className={`w-4 h-4 ${
                      !cid ? "text-gray-300 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                )}
              </Button>
            )}
          </div>
          {id === "welcome-individual" && (
            <>
              <WelcomeActionButtons />
              {/* 연령대별 추천 요금제 카드: 가족스페이스 버튼 아래에, 초록색 강조 */}
              <AgePlanRecommendationCard userAge={user?.age} />
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default memo(MessageItem);
