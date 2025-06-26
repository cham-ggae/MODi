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
    benefit: string; // 📍 [추가] 요금제별 혜택 상세 (텍스트)
  }
> = {
  1: {
    name: "5G 프리미어 에센셜",
    description: "데이터와 통화의 필수적인 선택",
    price: "월 85,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409",
    benefit:
      "음성통화: 집/이동전화 무제한(+부가통화 300분) 문자메시지: 기본제공 기본혜택: U+모바일tv 기본 월정액 무료",
  },
  2: {
    name: "5G 시그니처",
    description: "가장 완벽한 5G 경험",
    price: "월 130,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000406",
    benefit:
      "미디어 혜택: 유튜브 프리미엄, 디즈니+, 넷플릭스, 티빙 중 택 2 무료 음성통화: 집/이동전화 무제한 문자메시지: 기본제공",
  },
  4: {
    name: "5G 프리미어 레귤러",
    description: "미디어 혜택과 데이터의 균형",
    price: "월 95,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433",
    benefit:
      "미디어 혜택: 유튜브 프리미엄 또는 디즈니+ 무료 음성통화: 집/이동전화 무제한 문자메시지: 기본제공",
  },
  6: {
    name: "5G 데이터 레귤러",
    description: "넉넉한 데이터와 무제한 통화",
    price: "월 63,000원",
    color: "emerald",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783",
    benefit:
      "음성통화: 집/이동전화 무제한(+부가통화 300분) 문자메시지: 기본제공 데이터: 50GB 소진 후 1Mbps 속도제어",
  },
  8: {
    name: "5G 라이트+",
    description: "가볍게 시작하는 5G 라이프",
    price: "월 55,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000437",
    benefit:
      "음성통화: 집/이동전화 무제한(+부가통화 300분) 문자메시지: 기본제공 데이터: 14GB 소진 후 1Mbps 속도제어",
  },
  10: {
    name: "5G 미니",
    description: "알뜰하고 컴팩트한 5G",
    price: "월 37,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1000325",
    benefit: "음성통화: 집/이동전화 무제한 문자메시지: 기본제공 데이터: 6GB",
  },
  12: {
    name: "5G 슬림+",
    description: "가성비 좋은 슬림한 5G",
    price: "월 47,000원",
    color: "emerald",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000487",
    benefit:
      "음성통화: 집/이동전화 무제한(+부가통화 300분) 문자메시지: 기본제공 데이터: 9GB 소진 후 400kbps 속도제어",
  },
  13: {
    name: "5G 프리미어 플러스",
    description: "다양한 프리미엄 혜택까지",
    price: "월 105,000원",
    color: "blue",
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252",
    benefit:
      "미디어 혜택: 유튜브 프리미엄, 디즈니+, 넷플릭스 중 택 1 무료 음성통화: 집/이동전화 무제한 문자메시지: 기본제공",
  },
  37: {
    name: "5G 프리미어 슈퍼",
    description: "최고의 혜택, 슈퍼 프리미엄",
    price: "월 115,000원",
    color: "blue",
    isRecommended: true,
    link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205251",
    benefit:
      "미디어 혜택: 유튜브 프리미엄, 디즈니+, 넷플릭스, 티빙 중 택 1 무료 음성통화: 집/이동전화 무제한 문자메시지: 기본제공",
  },
};

// 설문 결과 유형별 상세 설정

export const userTypes: Record<string, UserType> = {
  호박벌형: {
    type: "호박벌형",
    emoji: "🐝",
    title: "데이터 없으면 그냥 벽돌폰 아닌가요?",
    description: `📶 “와이파이? 느려서 못 써요”
LTE로 바로 튀는 데이터 본능형

🚆 출퇴근은 유튜브, 인스타 릴스 루틴
데이터 소진 알림 뜨면 식은땀 남 
        `,
    recommendations: ["5G 프리미어 에센셜", "5G 프리미어 레귤러"],
    savings: 25000,
    message: "꿀벌형인 당신, 꿀처럼 달콤한 무제한 데이터 요금제를 추천해요🍯",
  },
  개미형: {
    type: "개미형",
    emoji: "🐜",
    title: "가족 요금제? 아빠만 아는 비밀",
    description: `🧑‍👩‍👧‍👦 “요금제 뭐 써?”  
🙄 “몰라, 아빠가 알아서 했을걸?”

📡 가족 요금제 같이 쓰지만  
정작 누가 뭘 쓰는진 아무도 모름.

📲 데이터 부족하면?  
가족 단톡방에 “누구 좀 줘봐~”`,
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합"],
    savings: 45000,
    message: `이젠 당신도 한 번쯤 챙겨볼 타이밍.
가족끼리 요금제 공유하고, 새싹도 같이 키워보세요🌱`,
  },
  무당벌레형: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "카톡보단 전화로 해줘..",
    description: `📞 “전화는 3초 안에 받아야죠”
카톡보다 목소리가 더 편한 타입

📱 하루 통화 시간 보면 나도 놀람
요금제는 당연히 통화 무제한`,
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 0,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  라바형: {
    type: "라바형",
    emoji: "🐛",
    title: "혜택도 좋지만.. 요금부터 봅시다",
    description: `🧾 “요금부터 봐야죠. 혜택은 덤”
할인·결합·이벤트 다 챙겨보는 실속러

💸 청구서 보고 ‘이번 달도 막았다’
그럴 땐 괜히 뿌듯한 사람
                    `,
    recommendations: ["유쓰 5G 미니", "유쓰 5G 슬림+"],
    savings: 15000,
    message: "라바는 물 한 방울도 아깝다! 알뜰한 당신에게 꼭 맞는 요금제가 있어요🍃",
  },
  나비형: {
    type: "나비형",
    emoji: "🦋",
    title: "멤버십, 제휴 할인 그래서 뭐가 있죠?",
    description: `🎁 “이거 포인트 적립돼요?”
제휴 혜택은 다 외우고 다님

🛍️ 혜택 보이면 “어머 이건 사야 돼”
가성비와 감성 모두 챙기는 타입`,
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

// bugId를 bugName으로 변환하기 위한 맵
export const bugIdToNameMap: Record<number, string> = {
  1: "호박벌형",
  2: "무당벌레형",
  3: "라바형",
  4: "나비형",
  5: "개미형", // 장수풍뎅이형이 아닌 개미형으로 API가 응답하는 경우가 있어 개미형으로 유지
};
