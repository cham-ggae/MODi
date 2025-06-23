"use client";

import { useEffect, useState } from "react";

/**
 * 실제 API 호출 버전
 */
export interface SurveyResult {
  bugId: number;
  bugName: string;
  suggest1: number;
  suggest2: number;
  benefit?: string[];
  feature?: string;
  personality?: string;
}

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

    fetch(`http://localhost:8090/surveyResult/${bugId}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((result) => {
        setData(result);
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
