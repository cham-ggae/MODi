import React from "react";

interface PlanRecommendationCardProps {
  name: string;
  price: string;
  benefit: string;
  link: string;
}

// 임시 아이콘 경로 (public/images/에 적절한 아이콘을 넣어주세요)
const ICONS = {
  call: "/images/ant.png", // 음성통화 아이콘
  message: "/images/bee.png", // 문자서비스 아이콘
  benefit: "/images/butterfly.png", // 기본혜택 아이콘
};

function parseBenefits(benefit: string) {
  // 항상 음성통화, 문자서비스, 기본혜택 순서로 추출
  const lines = benefit.split("\n");
  const call = lines.find((l) => l.includes("음성통화")) || "음성통화: -";
  const message = lines.find((l) => l.includes("문자")) || "문자서비스: -";
  const extra = lines.find((l) => l.includes("기본혜택")) || "기본혜택: -";
  return [
    { icon: ICONS.call, label: call.split(":")[0], value: call.split(":")[1]?.trim() || "-" },
    {
      icon: ICONS.message,
      label: message.split(":")[0],
      value: message.split(":")[1]?.trim() || "-",
    },
    { icon: ICONS.benefit, label: extra.split(":")[0], value: extra.split(":")[1]?.trim() || "-" },
  ];
}

export function PlanRecommendationCard({
  name,
  price,
  benefit,
  link,
}: PlanRecommendationCardProps) {
  const benefits = parseBenefits(benefit);
  return (
    <div className="relative bg-[#E5E5E5]/30 rounded-2xl p-4 w-full min-w-0 flex flex-col shadow-none border-none">
      {/* 자세히보기 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-6 top-6 text-xs text-gray-400 font-semibold hover:underline mb-3"
      >
        자세히보기
      </a>
      {/* 요금제명 */}
      <div className="font-bold text-[17px] text-black mb-1 mt-8">{name}</div>
      {/* 가격 */}
      <div className="font-bold text-[20px] text-[#14ae5c] mb-4">월 {price}</div>
      {/* 혜택 3줄 */}
      <div className="flex flex-col gap-1 mt-2">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-3 text-[15px] font-semibold text-black">
            <img src={b.icon} alt={b.label} className="w-5 h-5" />
            <span className="w-[90px] text-left">{b.label}</span>
            <span className="flex-1 text-right">{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
