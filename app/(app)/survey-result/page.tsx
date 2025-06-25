"use client";

import { Suspense } from "react";
import SurveyResultContent from "@/components/survey/SurveyResultContent";
import { FullScreenLoading } from "@/components/ui/loading";

// useSearchParams를 사용하기 위해 페이지를 Suspense로 감싸는 구조
export default function SurveyResultPage() {
  return (
    <Suspense fallback={<FullScreenLoading size="lg" />}>
      <SurveyResultContent />
    </Suspense>
  );
}
