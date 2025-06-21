import React from "react";
import { Check, Star, Zap } from "lucide-react";

/**
 * API 응답으로 받은 혜택 문자열(HTML)을 파싱하여
 * 제목과 내용의 객체 배열로 변환하는 함수.
 * @param {string} benefitString - 파싱할 HTML 형식의 문자열
 * @returns {Array<{ title: string; content: string }>} - 파싱된 혜택 객체 배열
 */
export const parseBenefitString = (
  benefitString: string
): Array<{ title: string; content: string }> => {
  if (!benefitString) return [];
  const benefits: Array<{ title: string; content: string }> = [];
  const regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/g;
  let match;
  while ((match = regex.exec(benefitString)) !== null) {
    benefits.push({ title: match[1].trim(), content: match[2].trim() });
  }
  return benefits;
};

/**
 * 혜택 제목에 따라 적절한 아이콘 컴포넌트를 반환하는 함수.
 * @param {string} title - 아이콘을 결정할 혜택 제목
 * @returns {React.ReactNode} - Lucide 아이콘 컴포넌트
 */
export const getBenefitIcon = (title: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    음성통화: <Check className="w-3 h-3 text-white" />,
    문자메시지: <Zap className="w-3 h-3 text-white" />,
    기본혜택: <Star className="w-3 h-3 text-white" />,
  };
  return iconMap[title] || <Check className="w-3 h-3 text-white" />;
};
