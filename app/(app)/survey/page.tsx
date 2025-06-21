"use client";

import { ArrowLeft } from "lucide-react";
import { useSurvey } from "@/hooks/useSurveyFlow";
import { SurveyProgressBar } from "@/components/survey/SurveyProgressBar";
import { SurveyQuestionCard } from "@/components/survey/SurveyQuestionCard";

export default function SurveyPage() {
  const { currentQuestion, totalQuestions, currentQ, handleAnswer, handleBack } = useSurvey();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center p-4">
        <ArrowLeft
          className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={handleBack}
        />
      </div>

      {/* Progress Bar */}
      <SurveyProgressBar currentStep={currentQuestion + 1} totalSteps={totalQuestions} />

      {/* Question Card */}
      {currentQ && <SurveyQuestionCard question={currentQ} onAnswer={handleAnswer} />}

      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-16">
        딱 맞는 요금제 추천해드릴게요!
      </p>
    </div>
  );
}
