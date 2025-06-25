import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { PlanRecommendationCard } from "@/components/chat/PlanRecommendationCard";
import { ageMockPlanMap } from "@/lib/plan-recommendation-data";

function toKoreanAgeGroup(
  age: string | undefined
): "10대" | "20대" | "30대" | "40대" | "50대 이상" | null {
  if (!age) return null;
  if (age.startsWith("10")) return "10대";
  if (age.startsWith("20")) return "20대";
  if (age.startsWith("30")) return "30대";
  if (age.startsWith("40")) return "40대";
  if (
    age.startsWith("50") ||
    age.startsWith("60") ||
    age.startsWith("70") ||
    age.startsWith("80") ||
    age.startsWith("90")
  )
    return "50대 이상";
  return null;
}

export default function AgePlanRecommendationBubble({
  userAge,
  onSurvey,
}: {
  userAge?: string;
  onSurvey: () => void;
}) {
  const age = toKoreanAgeGroup(userAge);
  if (!age || !ageMockPlanMap[age]) return null;
  const plans = ageMockPlanMap[age];
  const [current, setCurrent] = React.useState(0);
  const [api, setApi] = React.useState<any>(null);
  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  return (
    <div className="flex justify-start">
      <div className="max-w-xs px-4 py-3 rounded-2xl ml-[3rem] bg-white text-gray-900 border border-gray-200 mt-2 mb-2">
        {/* Title */}
        <div className="font-bold text-base mb-2 text-left text-black">{age} 추천 요금제</div>
        {/* Divider */}
        <div className="w-full h-px bg-[#D9D9D9] mb-4" />
        {/* Carousel */}
        <Carousel opts={{ align: "start" }} setApi={setApi}>
          <CarouselContent>
            {plans.map((plan, idx) => (
              <CarouselItem key={plan.name} className="basis-full flex justify-center">
                <PlanRecommendationCard
                  name={plan.name}
                  price={plan.price}
                  benefit={plan.benefit}
                  link={plan.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-3 mb-4">
          {plans.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                current === idx ? "bg-[#5bc236]" : "bg-[#C4C4C4]"
              } transition-all`}
            />
          ))}
        </div>
        {/* 안내 텍스트 - 흰색 배경, 버튼 아님 */}
        <div className="text-xs text-gray-500 bg-white rounded-md px-3 py-2 text-center mb-3 border border-gray-100">
          더 정확한 요금제를 추천 받고 싶다면?
        </div>
        {/* 버튼 */}
        <button
          className="w-full h-10  text-[#5bc236] border-[#5bc236] border rounded-xl font-semibold text-[15px] hover:bg-[#5bc236] hover:text-white transition"
          onClick={onSurvey}
        >
          통신 성향 검사하기
        </button>
      </div>
    </div>
  );
}
