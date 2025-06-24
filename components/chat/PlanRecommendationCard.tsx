import React from "react";

interface PlanRecommendationCardProps {
  name: string;
  price: string;
  benefit: string;
  link: string;
}

export function PlanRecommendationCard({
  name,
  price,
  benefit,
  link,
}: PlanRecommendationCardProps) {
  return (
    <div className="rounded-xl border p-4 mb-3 bg-white shadow">
      <div className="font-bold text-lg mb-1">{name}</div>
      <div className="text-green-600 font-semibold mb-2">{price}</div>
      <div className="text-sm text-gray-700 mb-2 whitespace-pre-line">{benefit}</div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-green-700 rounded hover:bg-emerald-200 transition"
      >
        요금제 자세히 보기
      </a>
    </div>
  );
}
