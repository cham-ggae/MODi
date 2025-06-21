import { UserType } from "@/types/survey.type";

// [정적 데이터 모음] 설문 결과 페이지에서 사용하는 유형별 정보, 요금제 상세, 이미지 매핑 등

// 사용자 유형(UserType)에 대한 타입 정의
// export interface UserType {
//   type: string; // 유형 이름 (ex. 호박벌형)
//   emoji: string; // 이모지
//   title: string; // 유형별 타이틀 문구
//   description: string; // 특징 설명
//   recommendations: string[]; // 추천 요금제 이름
//   savings: number; // 절약 가능 금액
//   message: string; // 하단 메시지
// }

// 요금제 상세 정보 매핑 (plan_id → 요금제 내용)
export const planDetails: Record<
  number,
  {
    name: string; // 요금제 이름
    description: string; // 간단한 요약 설명
    price: string; // 월 요금
    color: string; // 카드 색상 테마
    isRecommended?: boolean; // 추천 여부
    link: string; // 외부 링크
  }
> = {
  1: {
    name: "5G 프리미어 에센셜",
    description: "데이터와 통화의 필수적인 선택",
    price: "월 85,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409",
  },
  4: {
    name: "5G 프리미어 레귤러",
    description: "미디어 혜택과 데이터의 균형",
    price: "월 95,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433",
  },
  6: {
    name: "5G 데이터 레귤러",
    description: "넉넉한 데이터와 무제한 통화",
    price: "월 63,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783",
  },
  8: {
    name: "5G 라이트+",
    description: "가볍게 시작하는 5G 라이프",
    price: "월 55,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000437",
  },
  10: {
    name: "5G 미니",
    description: "알뜰하고 컴팩트한 5G",
    price: "월 37,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1000325",
  },
  12: {
    name: "5G 슬림+",
    description: "가성비 좋은 슬림한 5G",
    price: "월 47,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000487",
  },
  13: {
    name: "5G 프리미어 플러스",
    description: "다양한 프리미엄 혜택까지",
    price: "월 105,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252",
  },
  37: {
    name: "5G 프리미어 슈퍼",
    description: "최고의 혜택, 슈퍼 프리미엄",
    price: "월 115,000원",
    color: "blue",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205251",
  },
};

// 설문 결과 유형별 상세 설정

export const userTypes: Record<string, UserType> = {
  호박벌형: {
    type: "호박벌형",
    emoji: "🐝",
    title: "데이터 쓰는 꿀박형",
    description: "인터넷은 공기 같은 존재, 데이터가 부족하면 진짜 불편해!",
    recommendations: ["5G 프리미어 에센셜", "5G 프리미어 레귤러"],
    savings: 25000,
    message: "꿀벌형인 당신, 멈추지 마세요! 꿀처럼 달콤한 무제한 요금제를 추천해요🍯",
  },
  개미형: {
    type: "개미형",
    emoji: "🐜",
    title: "내 가족은 내가 지킨다",
    description: `💰 혜택 보다는 실속임. 결합할수록 이득 따짐.

👨‍👩‍👧‍👦 가족과 같이 쓰지만 서로 뭘 쓰는지 모름.

🤷‍♂️ 누가 요금제 뭐쓰냐하면 "몰라? 아빠가 알걸" 이라고 함.

📱 데이터 부족하면 가족한테 달라고 함.`,
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합"],
    savings: 45000,
    message: `이젠 당신도 한 번쯤 챙겨볼 타이밍.
가족끼리 요금제 공유하고, 새싹도 같이 키워보세요🌱`,
  },
  무당벌레형: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "TMI를 주고 받는게 일상!",
    description: "통화, 문자는 제 삶의 기본값, 연락은 진심이라구요!",
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 0,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  라바형: {
    type: "라바형",
    emoji: "🐛",
    title: "티끌 모아 태산, 요금도 전략적으로",
    description: "혜택보다 중요한 건 내 지갑 사정. 꼭 필요한 기능만!",
    recommendations: ["유쓰 5G 미니", "유쓰 5G 슬림+"],
    savings: 15000,
    message: "애벌레는 물 한 방울도 아깝지요! 알뜰한 당신에게 꼭 맞는 요금제가 있어요🍃",
  },
  나비형: {
    type: "나비형",
    emoji: "🦋",
    title: "알잘딱깔센 요금 마스터",
    description: "알아서 잘! 딱! 깔끔하고 센스 있게! 멤버십·제휴 할인 골라쓰는 재미~",
    recommendations: ["5G 프리미어 플러스", "U+ 멤버십 결합 상품"],
    savings: 35000,
    message:
      "나비형은 아름답게 혜택을 날개처럼 펼치죠🦋 지금 당신에게 가장 유리한 조건으로 안내할게요!",
  },
};

// 유형명 → 캐릭터 이미지 경로 매핑
export const typeImageMap: Record<string, string> = {
  호박벌형: "/images/bee.png",
  라바형: "/images/larva.png",
  무당벌레형: "/images/ladybug.png",
  개미형: "/images/ant.png",
  나비형: "/images/butterfly.png",
};
