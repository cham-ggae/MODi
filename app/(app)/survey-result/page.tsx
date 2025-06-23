"use client";

import { Suspense } from "react";
import SurveyResultContent from "@/components/survey/SurveyResultContent";

// useSearchParams를 사용하기 위해 페이지를 Suspense로 감싸는 구조
export default function SurveyResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      }
    >
      <SurveyResultContent />
    </Suspense>
  );
}
