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
    미디어혜택: <Star className="w-3 h-3 text-white" />,
    데이터: <Check className="w-3 h-3 text-white" />,
  };
  return iconMap[title] || <Check className="w-3 h-3 text-white" />;
};

/**
 * 일반 텍스트로 된 혜택 설명을 HTML로 변환
 * 각 혜택 항목을 '<h3>제목</h3><p>내용</p>' 형식으로 만듬
 * 예: "음성통화: 무제한(+부가통화 300분) 문자메시지: 기본제공"
 * -> "<h3>음성통화</h3><p>무제한(+부가통화 300분)</p><h3>문자메시지</h3><p>기본제공</p>"
 * @param text - 변환할 혜택 텍스트
 * @returns HTML 형식의 문자열
 */
export const transformBenefitTextToHtml = (text: string): string => {
  if (!text) return "";

  // 정규식을 사용하여 "항목명: 내용" 패턴을 찾습니다.
  // 다음 항목명이 나오기 전까지의 모든 내용을 해당 항목의 내용으로 간주합니다.
  const regex = /(\S+?):\s*(.*?)(?=\s+\S+?:|$)/g;

  let html = "";
  let match;
  while ((match = regex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    html += `<h3>${title}</h3><p>${content}</p>`;
  }

  return html;
};
