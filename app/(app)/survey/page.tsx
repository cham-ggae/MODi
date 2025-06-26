"use client";

import { ArrowLeft } from "lucide-react";
import { useSurvey } from "@/hooks/useSurveyFlow";
import { SurveyProgressBar } from "@/components/survey/SurveyProgressBar";
import { SurveyQuestionCard } from "@/components/survey/SurveyQuestionCard";

export default function SurveyPage() {
  const { currentQuestion, totalQuestions, currentQ, handleAnswer, handleBack } = useSurvey();

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center p-3 flex-shrink-0">
        <ArrowLeft
          className="w-5 h-5 text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={handleBack}
        />
      </div>

      {/* Progress Bar */}
      <div className="flex-shrink-0 px-4 pb-1">
        <SurveyProgressBar currentStep={currentQuestion + 1} totalSteps={totalQuestions} />
      </div>

      {/* Question Card - 남은 공간 모두 활용 */}
      <div className="flex-1 px-4 min-h-0">
        {currentQ && <SurveyQuestionCard question={currentQ} onAnswer={handleAnswer} />}
      </div>

      {/* Footer Text */}
      <div className="flex-shrink-0 p-3">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          딱 맞는 요금제 추천해드릴게요!
        </p>
      </div>
    </div>
  );
}
