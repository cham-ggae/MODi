"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { surveyApi } from "@/lib/api/survey-result";
import type { SurveyResult } from "@/types/survey.type";

/**
 * 실제 API 호출 버전
 */

interface Options {
  enabled?: boolean;
}

export function useGetSurveyResult(bugId: number, { enabled = true }: Options = {}) {
  const [data, setData] = useState<SurveyResult | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setIsLoading(true);
    surveyApi
      .getSurveyResult(bugId)
      .then((result) => {
        // SurveyResultResponse -> SurveyResult 변환
        setData({
          type: result.bugName, // or bugNameUiMap[result.bugName] if needed
          description: result.feature,
          recommendations: [String(result.suggest1), String(result.suggest2)],
          suggest1: result.suggest1,
          suggest2: result.suggest2,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setIsLoading(false);
      });
  }, [bugId, enabled]);

  return { data, isLoading, isError };
}

// 설문 결과 저장(POST) 함수 (일반 함수)
export async function postSurveyResult(bugId: number) {
  return surveyApi.postSurveyResult(bugId);
}

// React Query용 커스텀 훅
export function usePostSurveyResult() {
  return useMutation({
    mutationFn: (bugId: number) => surveyApi.postSurveyResult(bugId),
  });
}
