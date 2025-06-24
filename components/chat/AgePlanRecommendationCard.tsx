import React from "react";
import { ageMockPlanMap } from "@/lib/plan-recommendation-data";

interface AgePlanRecommendationCardProps {
  userAge?: string;
}

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

const AgePlanRecommendationCard: React.FC<AgePlanRecommendationCardProps> = ({ userAge }) => {
  const age = toKoreanAgeGroup(userAge);
  if (!age || !ageMockPlanMap[age]) return null;
  return (
    <div className="mt-4 flex flex-col items-stretch">
      {ageMockPlanMap[age].map(
        (plan: { name: string; price: string; link: string }, idx: number) => {
          const today = new Date();
          const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;
          return (
            <div
              key={plan.name}
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl ${
                idx !== ageMockPlanMap[age].length - 1 ? "mb-3" : ""
              }`}
            >
              <div>
                <div className="text-base font-bold text-black mb-1">{plan.name}</div>
                <div className="text-sm text-black">{plan.price}</div>
              </div>
              <div className="flex flex-col items-end ml-2">
                <span className="text-xs text-gray-400 mb-1">{dateStr}</span>
                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black font-medium hover:underline"
                >
                  자세히
                </a>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AgePlanRecommendationCard;
