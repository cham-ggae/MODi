export const agePlanMap = {
  "10대": [35, 43, 38],
  "20대": [5, 28, 20],
  "30대": [1, 7, 2],
  "40대": [4, 22, 6],
  "50대 이상": [17, 14, 15],
};

// 연령대별 추천 요금제명 매핑 (실제 요금제명 기준)
export const agePlanNameMap = {
  "10대": ["5G 라이트 청소년", "LTE청소년19", "(LTE) 추가 요금 걱정 없는 데이터 청소년 33"],
  "20대": ["유쓰 5G 데이터 플러스", "유쓰 5G 스탠다드 에센셜", "유쓰 5G 미니"],
  "30대": ["5G 프리미어 에센셜", "5G 데이터 플러스", "5G 스탠다드"],
  "40대": ["5G 프리미어 레귤러", "5G 베이직+", "5G 데이터 레귤러"],
  "50대 이상": ["5G 시니어 A형", "5G 시니어 B형", "(LTE) 데이터 시니어 33"],
};

// 연령대별 요금제 추천 목업 데이터 (고정)
export const ageMockPlanMap = {
  "10대": [
    {
      name: "5G 라이트 청소년",
      price: "45,000원",
      benefit: "음성통화: 무제한 \n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv라이트 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0000417",
    },
    {
      name: "LTE청소년19",
      price: "20,900원",
      benefit: "음성통화: 20,000링(1초에 2.5링)\n문자메시지: 1,000건",
      link: "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0001369",
    },
    {
      name: "(LTE) 추가 요금 걱정 없는 데이터 청소년 33",
      price: "33,000원",
      benefit: "음성통화: 무제한 \n문자메시지: 기본제공",
      link: "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0000467",
    },
  ],
  "20대": [
    {
      name: "유쓰 5G 데이터 플러스",
      price: "66,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000229",
    },
    {
      name: "유쓰 5G 스탠다드 에센셜",
      price: "70,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000231",
    },
    {
      name: "유쓰 5G 미니",
      price: "37,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 라이트 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1001051",
    },
  ],
  "30대": [
    {
      name: "5G 프리미어 에센셜",
      price: "85,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 기본 월정액 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409",
    },
    {
      name: "5G 데이터 플러스",
      price: "66,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 기본 월정액 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000782",
    },
    {
      name: "5G 스탠다드",
      price: "75,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 기본 월정액 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000415",
    },
  ],
  "40대": [
    {
      name: "5G 프리미어 레귤러",
      price: "95,000원",
      benefit:
        "미디어 혜택: 콘텐츠, 음악 감상 등최대 9,900원 혜택\n음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 기본 월정액 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433",
    },
    {
      name: "5G 베이직+",
      price: "59,000원",
      benefit: "음성통화: 무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv라이트 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1001268",
    },
    {
      name: "5G 데이터 레귤러",
      price: "63,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv 기본 월정액 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783",
    },
  ],
  "50대 이상": [
    {
      name: "5G 시니어 A형",
      price: "45,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv라이트 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-senior/LPZ0000418",
    },
    {
      name: "5G 시니어 B형",
      price: "43,000원",
      benefit: "음성통화:  무제한\n문자메시지: 기본제공\n기본혜택: U⁺ 모바일tv라이트 무료",
      link: "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-senior/LPZ1000127",
    },
    {
      name: "(LTE) 데이터 시니어 33",
      price: "33,000원",
      benefit: "음성통화: 무제한\n문자메시지: 기본제공\n기본혜택: 실버지킴이",
      link: "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0000296",
    },
  ],
};
