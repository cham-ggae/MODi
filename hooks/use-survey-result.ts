import { useMutation, useQuery } from "@tanstack/react-query";
import { surveyApi } from "@/lib/api/survey-result";
import type { SurveyResultRequest, SurveyResultResponse } from "@/types/survey.type";

// 설문 결과 저장 (POST)
export function usePostSurveyResult() {
  return useMutation<SurveyResultResponse, Error, number>({
    mutationFn: (bugId: number) => surveyApi.postSurveyResult(bugId),
  });
}

// 설문 결과 조회 (GET)
export function useGetSurveyResult(bugId: number, options?: { enabled?: boolean }) {
  return useQuery<SurveyResultResponse, Error>({
    queryKey: ["surveyResult", bugId],
    queryFn: () => surveyApi.getSurveyResult(bugId),
    enabled: options?.enabled !== false,
  });
}
