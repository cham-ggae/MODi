// 설문 관련 데이터 및 순수 함수

// 점수 기준 정의 - 각 유형별 특성을 반영한 점수 체계
export const scoringCriteria = {
  1: [1, 2, 1, 1, 1], // Q1: 통화(2점), 데이터(1점), 혜택(1점), 가족(1점), 가격(1점)
  2: [1, 1, 1, 1, 1], // Q2: 데이터 사용량 - 모든 선택지 동일 점수
  3: [1, 1, 2, 1, 1], // Q3: 가격 중시(2점), 데이터(1점), 가족(1점), 혜택(1점), 가격(1점)
  4: [1, 1, 1, 2, 1], // Q4: 혜택(2점), 가격(1점), 혜택(1점), 가족(1점), 상황(1점)
  5: [1, 2, 1, 1, 1], // Q5: 통화(2점), 상담(1점), 통화(1점), 문자(1점), 영상통화(1점)
  6: [1, 1, 1, 2, 1], // Q6: 혜택(2점), 비교(1점), 가족(1점), 통화(1점), 데이터(1점)
  7: [1, 1, 2, 1, 1], // Q7: 데이터(2점), 가격(1점), 혜택(1점), 가족(1점), 통화(1점)
};

//총점 최소, 최대 계산
export const minScore = Object.values(scoringCriteria).reduce(
  (sum, arr) => sum + Math.min(...arr),
  0
);
export const maxScore = Object.values(scoringCriteria).reduce(
  (sum, arr) => sum + Math.max(...arr),
  0
);

export const surveyQuestions = [
  {
    id: 1,
    question: "스마트폰에서 제일 중요한 건?",
    options: [
      { emoji: "🎁", label: "혜택 많아야죠", value: "benefit" },
      { emoji: "📞", label: "전화 잘돼야죠", value: "call" },
      { emoji: "🎬", label: "영상은 무조건!", value: "data" },
      { emoji: "👨‍👩‍👧‍👦", label: "가족이랑 할인!", value: "family" },
      { emoji: "💸", label: " 실속이 최고", value: "price" },
    ],
  },
  {
    id: 2,
    question: "데이터 얼마나 써요?",
    options: [
      { emoji: "🗺️", label: "꼭 필요할 때만(지도, 뉴스 등..)", value: "minimal" },
      { emoji: "📱", label: "밖에서도 유튜브, 넷플릭스 필수!", value: "occasional" },
      { emoji: "🗣️", label: "가족 데이터 덕분에 넉넉하게~", value: "frequent" },
      { emoji: "✨", label: " SNS, 음악 자주 해요", value: "normal" },
      { emoji: "📞", label: " 통화가 메인이에요", value: "business" },
    ],
  },
  {
    id: 3,
    question: "요금제 고를 때, 나의 기준은?",
    options: [
      { emoji: "🗣️", label: "통화만 잘되면 오케이", value: "call" },
      { emoji: "🎇", label: "데이터 무제한", value: "data" },
      { emoji: "👨‍👩‍👧", label: "가족 할인", value: "family" },
      { emoji: "🎀", label: "혜택 챙기기", value: "benefit" },
      { emoji: "✌️", label: "가성비", value: "price" },
    ],
  },
  {
    id: 4,
    question: "기기나 요금제, 바꾸는 순간은?",
    options: [
      { emoji: "🙅‍♂️", label: "잘 안바꿈", value: "cheap" },
      { emoji: "🏃‍♂️", label: "신상 나오면 바로 바꿈", value: "new" },
      { emoji: "🤩", label: "혜택 좋으면 바로 갈아타야지", value: "benefit" },
      { emoji: "👨‍👩‍👧‍👦", label: "가족이 바꾸면 나도..", value: "family" },
      { emoji: "🤔", label: "상황되면 바꿔야지..", value: "occasional" },
    ],
  },
  {
    id: 5,
    question: "나는 이럴때 통화한다.",
    options: [
      { emoji: "👤", label: "가족이랑 자주 통화하는 편", value: "family" },
      { emoji: "🧙", label: "상담전화, 이벤트 콜 자주 받음", value: "business" },
      { emoji: "☎️", label: "그냥 일상적으로 자주 하는편 (1시간 이상)", value: "call" },
      { emoji: "✉️", label: "필요할때 주로 문자나 카톡만 하는 편", value: "text" },
      { emoji: "📽️", label: "영상 통화 많이!", value: "video" },
    ],
  },
  {
    id: 6,
    question: "난 이럴때 고민하지 않고 요금제 고른다.",
    options: [
      { emoji: "🤔", label: "그래도 비교는 해봐야지..", value: "compare" },
      { emoji: "🤩", label: "혜택 많네?", value: "benefit" },
      { emoji: "👥", label: "가족 할인 알차네", value: "family" },
      { emoji: "☎️", label: "통화만 잘되면 됐지", value: "call" },
      { emoji: "📲", label: "어디서나 데이터가 잘 돼야지", value: "data" },
    ],
  },
  {
    id: 7,
    question: "가장 공감 되는 말은?",
    options: [
      { emoji: "😒", label: "데이터 없는 건 폰이 없는거나 마찬가지!", value: "data" },
      { emoji: "🤑", label: "요금은 그냥 합리적으로 골라야지!", value: "price" },
      { emoji: "🥳", label: "이왕 쓸거 혜택도 챙겨야지!", value: "benefit" },
      { emoji: "👾", label: "가족 요금제 진짜 개이득!", value: "family" },
      { emoji: "🫥", label: "연락 잘 되는게 제일 중요!", value: "call" },
    ],
  },
];

// 점수 계산 함수
export const calculateScore = (answers: Record<number, string>) => {
  let totalScore = 0;

  Object.entries(answers).forEach(([questionId, selectedValue]) => {
    const questionNum = parseInt(questionId);
    const question = surveyQuestions.find((q) => q.id === questionNum);

    if (question) {
      const selectedIndex = question.options.findIndex((option) => option.value === selectedValue);
      if (selectedIndex !== -1) {
        totalScore += scoringCriteria[questionNum as keyof typeof scoringCriteria][selectedIndex];
      }
    }
  });

  return totalScore;
};

// 유형별 점수 계산 함수
export const calculateTypeScores = (answers: Record<number, string>) => {
  const scores = {
    라바형: 0, // 가격 중시 (알뜰형)
    무당벌레형: 0, // 통화 중시
    나비형: 0, // 혜택 중시
    개미형: 0, // 가족 중시
    호박벌형: 0, // 데이터 중시
  };

  Object.entries(answers).forEach(([questionId, selectedValue]) => {
    const questionNum = parseInt(questionId);

    // 각 질문별로 유형 점수 부여
    switch (questionNum) {
      case 1: // 스마트폰에서 중요한 것
        if (selectedValue === "price") scores.라바형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.개미형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 2: // 데이터 사용량
        if (selectedValue === "minimal") scores.라바형 += 2;
        if (selectedValue === "occasional") scores.호박벌형 += 2;
        if (selectedValue === "frequent") scores.개미형 += 2; // 가족 데이터 덕분에 → 가족형
        if (selectedValue === "normal") scores.호박벌형 += 1;
        if (selectedValue === "business") scores.무당벌레형 += 2;
        break;
      case 3: // 요금제 선택 기준
        if (selectedValue === "price") scores.라바형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.개미형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 4: // 기기/요금제 변경 시점
        if (selectedValue === "cheap") scores.라바형 += 2;
        if (selectedValue === "new") scores.나비형 += 1;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.개미형 += 2;
        if (selectedValue === "occasional") scores.라바형 += 1; // "상황되면" -> 알뜰 성향
        break;
      case 5: // 통화 패턴
        if (selectedValue === "family") scores.개미형 += 2; // 가족과 통화 → 가족형
        if (selectedValue === "business") scores.무당벌레형 += 1;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "text") scores.라바형 += 1; // 문자/카톡 위주 -> 알뜰 성향
        if (selectedValue === "video") scores.호박벌형 += 1;
        break;
      case 6: // 요금제 선택 기준
        if (selectedValue === "compare") scores.라바형 += 1; // 비교 -> 알뜰 성향
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.개미형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 7: // 공감되는 말
        if (selectedValue === "price") scores.라바형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.개미형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
    }
  });

  return scores;
};

// 결과 분석 함수
export const analyzeResult = (totalScore: number, answers: Record<number, string>) => {
  const typeScores = calculateTypeScores(answers);

  // 가장 높은 점수의 유형 찾기
  const maxScore = Math.max(...Object.values(typeScores));
  const maxTypes = Object.entries(typeScores).filter(([_, score]) => score === maxScore);

  // 동점인 경우 우선순위 적용
  let selectedType = maxTypes[0][0];

  if (maxTypes.length > 1) {
    // 동점인 경우 우선순위: 개미형(가족) > 나비형(혜택) > 호박벌형(데이터) > 무당벌레형(통화) > 라바형(알뜰)
    const priority = ["개미형", "나비형", "호박벌형", "무당벌레형", "라바형"];
    for (const priorityType of priority) {
      if (maxTypes.find(([type]) => type === priorityType)) {
        selectedType = priorityType;
        break;
      }
    }
  }

  // 유형만 반환 (상세 정보는 result 페이지에서 처리)
  return {
    type: selectedType,
  };
};

export const typeToBugId: Record<string, number> = {
  호박벌형: 1,
  무당벌레형: 2,
  라바형: 3,
  나비형: 4,
  개미형: 5, // 가족형. DB에서는 '장수풍뎅이'로 처리
};
