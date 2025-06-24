"use client";

// 설문 흐름 및 상태를 관리하는 커스텀 훅
// - 질문 순서 제어
// - 응답 처리 및 저장
// - 결과 계산 및 API 전송 포함

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePostSurveyResult } from "@/hooks/use-survey-result";
import {
  calculateScore,
  analyzeResult,
  typeToBugId,
  calculateTypeScores,
  surveyQuestions,
} from "@/lib/surveyLogic";

export function useSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const postSurveyResult = usePostSurveyResult();

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion + 1]: value };
    setAnswers(newAnswers);

    if (currentQuestion < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // Survey complete
      const totalScore = calculateScore(newAnswers);
      const result = analyzeResult(totalScore, newAnswers);

      // Debugging logs
      const typeScores = calculateTypeScores(newAnswers);
      console.log("설문 답변:", newAnswers);
      console.log("유형별 점수:", typeScores);
      console.log("선택된 유형:", result.type);
      console.log("매핑된 bugId:", typeToBugId[result.type]);

      // Save to localStorage
      localStorage.setItem("surveyAnswers", JSON.stringify(newAnswers));
      localStorage.setItem("surveyScore", totalScore.toString());
      localStorage.setItem("surveyResult", JSON.stringify(result));
      localStorage.setItem("surveyCompletedAt", new Date().toISOString());

      // API call and navigation
      const bugId = typeToBugId[result.type];
      const isFromMission = searchParams.get("mission") === "true";

      try {
        await postSurveyResult.mutateAsync(bugId);
        const resultUrl = isFromMission
          ? `/survey-result?bugId=${bugId}&mission=true`
          : `/survey-result?bugId=${bugId}`;
        router.push(resultUrl);
      } catch (e) {
        alert("설문 결과 저장에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.back();
    }
  };

  const progress = Math.round(((currentQuestion + 1) / surveyQuestions.length) * 100);
  const currentQ = surveyQuestions[currentQuestion];

  return {
    currentQuestion,
    progress,
    totalQuestions: surveyQuestions.length,
    currentQ,
    handleAnswer,
    handleBack,
  };
}
