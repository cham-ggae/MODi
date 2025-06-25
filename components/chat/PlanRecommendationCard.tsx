import React from "react";

interface PlanRecommendationCardProps {
  name: string;
  price: string;
  benefit: string;
  link: string;
}

// 임시 아이콘 경로 (public/images/에 적절한 아이콘을 넣어주세요)
const ICONS = {
  data: "/images/bee.png", // 데이터 아이콘
  call: "/images/ant.png", // 음성통화 아이콘
  message: "/images/butterfly.png", // 문자서비스 아이콘
};

function parseBenefits(benefit: string) {
  // "음성통화: 집/이동전화 무제한(+부가통화 300분)\n문자메시지: 기본제공\n기본혜택: ..." 형식에서 주요 3개만 추출
  const lines = benefit.split("\n");
  const data = lines.find((l) => l.includes("데이터")) || "데이터: -";
  const call = lines.find((l) => l.includes("음성통화")) || "음성통화: -";
  const message = lines.find((l) => l.includes("문자")) || "문자서비스: -";
  return [
    { icon: ICONS.data, label: data.split(":")[0], value: data.split(":")[1]?.trim() || "-" },
    { icon: ICONS.call, label: call.split(":")[0], value: call.split(":")[1]?.trim() || "-" },
    {
      icon: ICONS.message,
      label: message.split(":")[0],
      value: message.split(":")[1]?.trim() || "-",
    },
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
    <div className="relative bg-[#E5E5E5]/30 rounded-2xl p-6 w-[313px] h-[230px] flex flex-col shadow-none border-none">
      {/* 자세히보기 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-6 top-6 text-xs text-gray-400 font-semibold hover:underline"
      >
        자세히보기
      </a>
      {/* 요금제명 */}
      <div className="font-bold text-[17px] text-black mb-1 mt-2">{name}</div>
      {/* 가격 */}
      <div className="font-bold text-[20px] text-[#14ae5c] mb-4">월 {price}</div>
      {/* 혜택 3줄 */}
      <div className="flex flex-col gap-3 mt-2">
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
