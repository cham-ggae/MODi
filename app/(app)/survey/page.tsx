"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePostSurveyResult } from "@/hooks/use-survey-result";

// 점수 기준 정의 - 각 유형별 특성을 반영한 점수 체계
const scoringCriteria = {
  1: [1, 2, 1, 1, 1], // Q1: 통화(2점), 데이터(1점), 혜택(1점), 가족(1점), 가격(1점)
  2: [1, 1, 1, 1, 1], // Q2: 데이터 사용량 - 모든 선택지 동일 점수
  3: [1, 1, 2, 1, 1], // Q3: 가격 중시(2점), 데이터(1점), 가족(1점), 혜택(1점), 가격(1점)
  4: [1, 1, 1, 2, 1], // Q4: 혜택(2점), 가격(1점), 혜택(1점), 가족(1점), 상황(1점)
  5: [1, 2, 1, 1, 1], // Q5: 통화(2점), 상담(1점), 통화(1점), 문자(1점), 영상통화(1점)
  6: [1, 1, 1, 2, 1], // Q6: 혜택(2점), 비교(1점), 가족(1점), 통화(1점), 데이터(1점)
  7: [1, 1, 2, 1, 1], // Q7: 데이터(2점), 가격(1점), 혜택(1점), 가족(1점), 통화(1점)
};

//총점 최소, 최대 계산
const minScore = Object.values(scoringCriteria).reduce((sum, arr) => sum + Math.min(...arr), 0);
const maxScore = Object.values(scoringCriteria).reduce((sum, arr) => sum + Math.max(...arr), 0);

const surveyQuestions = [
  {
    id: 1,
    question: "스마트폰에서 제일 중요한 건?",
    options: [
      { emoji: "📱", label: "혜택 많아야죠", value: "benefit" },
      { emoji: "💻", label: "전화 잘돼야죠", value: "call" },
      { emoji: "🎮", label: "영상은 무조건!", value: "data" },
      { emoji: "🔥", label: "가족이랑 할인!", value: "family" },
      { emoji: "🔥", label: " 실속이 최고", value: "price" },
    ],
  },
  {
    id: 2,
    question: "데이터 얼마나 써요?",
    options: [
      { emoji: "📞", label: "꼭 필요할 때만(지도, 뉴스 등..)", value: "minimal" },
      { emoji: "💬", label: "밖에서도 유튜브, 넷플릭스 필수!", value: "occasional" },
      { emoji: "🗣️", label: "가족 데이터 덕분에 넉넉하게~", value: "frequent" },
      { emoji: "📢", label: " SNS, 음악 자주 해요", value: "normal" },
      { emoji: "📢", label: " 통화가 메인이에요", value: "business" },
    ],
  },
  {
    id: 3,
    question: "요금제 고를 때, 나의 기준은?",
    options: [
      { emoji: "👤", label: "통화 많~이", value: "call" },
      { emoji: "👫", label: "데이터 무제한", value: "data" },
      { emoji: "👨‍👩‍👧", label: "가족 할인", value: "family" },
      { emoji: "👨‍👩‍👧‍👦", label: "혜택 챙기기", value: "benefit" },
      { emoji: "👨‍👩‍👧‍👦", label: "가성비", value: "price" },
    ],
  },
  {
    id: 4,
    question: "기기나 요금제, 바꾸는 순간은?",
    options: [
      { emoji: "👤", label: "잘 안바꿈", value: "cheap" },
      { emoji: "👫", label: "신상 나오면 바로 바꿈", value: "new" },
      { emoji: "👨‍👩‍👧", label: "혜택 좋으면 바로 갈아타야지", value: "benefit" },
      { emoji: "👨‍👩‍👧‍👦", label: "가족이 바꾸면 나도..", value: "family" },
      { emoji: "👨‍👩‍👧‍👦", label: "상황되면 바꿔야지..", value: "occasional" },
    ],
  },
  {
    id: 5,
    question: "나는 이럴때 통화한다.",
    options: [
      { emoji: "👤", label: "가족이랑 자주 통화하는 편", value: "family" },
      { emoji: "👫", label: "상담전화, 이벤트 콜 자주 받음", value: "business" },
      { emoji: "👨‍👩‍👧", label: "그냥 일상적으로 자주 하는편 (1시간 이상)", value: "call" },
      { emoji: "👨‍👩‍👧‍👦", label: "필요할때 주로 문자나 카톡만 하는 편", value: "text" },
      { emoji: "👨‍👩‍👧‍👦", label: "영상 통화 많이!", value: "video" },
    ],
  },
  {
    id: 6,
    question: "난 이럴때 고민하지 않고 요금제 고른다.",
    options: [
      { emoji: "👤", label: "그래도 비교는 해봐야지..", value: "compare" },
      { emoji: "👫", label: "혜택 많네?", value: "benefit" },
      { emoji: "👨‍👩‍👧", label: "가족 할인 알차네", value: "family" },
      { emoji: "👨‍👩‍👧‍👦", label: "통화만 잘되면 됐지", value: "call" },
      { emoji: "👨‍👩‍👧‍👦", label: "어디서나 데이터가 잘 돼야지", value: "data" },
    ],
  },
  {
    id: 7,
    question: "가장 공감 되는 말은?",
    options: [
      { emoji: "👤", label: "데이터 없는 건 폰이 없는거나 마찬가지!", value: "data" },
      { emoji: "👫", label: "요금은 그냥 합리적으로 골라야지!", value: "price" },
      { emoji: "👨‍👩‍👧", label: "이왕 쓸거 혜택도 챙겨야지!", value: "benefit" },
      { emoji: "👨‍👩‍👧‍👦", label: "가족 요금제 진짜 개이득!", value: "family" },
      { emoji: "👨‍👩‍👧‍👦", label: "연락 잘 되는게 제일 중요!", value: "call" },
    ],
  },
];

// 점수 계산 함수
const calculateScore = (answers: Record<number, string>) => {
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
const calculateTypeScores = (answers: Record<number, string>) => {
  const scores = {
    개미형: 0, // 가격 중시
    무당벌레형: 0, // 통화 중시
    나비형: 0, // 혜택 중시
    장수풍뎅이형: 0, // 가족 중시
    호박벌형: 0, // 데이터 중시
  };

  Object.entries(answers).forEach(([questionId, selectedValue]) => {
    const questionNum = parseInt(questionId);

    // 각 질문별로 유형 점수 부여
    switch (questionNum) {
      case 1: // 스마트폰에서 중요한 것
        if (selectedValue === "price") scores.개미형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 2: // 데이터 사용량
        if (selectedValue === "minimal") scores.개미형 += 2;
        if (selectedValue === "occasional") scores.호박벌형 += 2;
        if (selectedValue === "frequent") scores.호박벌형 += 3;
        if (selectedValue === "business") scores.무당벌레형 += 2;
        break;
      case 3: // 요금제 선택 기준
        if (selectedValue === "price") scores.개미형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 4: // 기기/요금제 변경 시점
        if (selectedValue === "cheap") scores.개미형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 2;
        break;
      case 5: // 통화 패턴
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 1;
        if (selectedValue === "video") scores.호박벌형 += 1;
        break;
      case 6: // 요금제 선택 기준
        if (selectedValue === "compare") scores.개미형 += 1;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
      case 7: // 공감되는 말
        if (selectedValue === "price") scores.개미형 += 2;
        if (selectedValue === "call") scores.무당벌레형 += 2;
        if (selectedValue === "benefit") scores.나비형 += 2;
        if (selectedValue === "family") scores.장수풍뎅이형 += 2;
        if (selectedValue === "data") scores.호박벌형 += 2;
        break;
    }
  });

  return scores;
};

// 결과 분석 함수
const analyzeResult = (totalScore: number, answers: Record<number, string>) => {
  const typeScores = calculateTypeScores(answers);

  // 가장 높은 점수의 유형 찾기
  const maxScore = Math.max(...Object.values(typeScores));
  const maxTypes = Object.entries(typeScores).filter(([_, score]) => score === maxScore);

  // 동점인 경우 우선순위 적용
  let selectedType = maxTypes[0][0];

  if (maxTypes.length > 1) {
    // 동점인 경우 우선순위: 장수풍뎅이형 > 나비형 > 호박벌형 > 무당벌레형 > 개미형
    const priority = ["장수풍뎅이형", "나비형", "호박벌형", "무당벌레형", "개미형"];
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

const typeToBugId: Record<string, number> = {
  개미형: 1,
  무당벌레형: 2,
  나비형: 3,
  장수풍뎅이형: 4,
  호박벌형: 5,
};

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();
  const postSurveyResult = usePostSurveyResult();

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion + 1]: value };
    setAnswers(newAnswers);

    if (currentQuestion < surveyQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // 설문 완료 - 점수 계산 및 결과 저장
      const totalScore = calculateScore(newAnswers);
      const result = analyzeResult(totalScore, newAnswers);

      localStorage.setItem("surveyAnswers", JSON.stringify(newAnswers));
      localStorage.setItem("surveyScore", totalScore.toString());
      localStorage.setItem("surveyResult", JSON.stringify(result));
      localStorage.setItem("surveyCompletedAt", new Date().toISOString());

      // bugId 매핑 및 API 호출
      const bugId = typeToBugId[result.type] || 1;
      try {
        await postSurveyResult.mutateAsync(bugId);
        setTimeout(() => router.push("/survey-result"), 500);
      } catch (e) {
        alert("설문 결과 저장에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const currentQ = surveyQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center p-4">
        <ArrowLeft
          className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={() =>
            currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : router.back()
          }
        />
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestion + 1} / {surveyQuestions.length}
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            {Math.round(((currentQuestion + 1) / surveyQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / surveyQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">
          {currentQ.question}
        </h1>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-3xl flex items-center space-x-4 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                {option.emoji}
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-16">
          딱 맞는 요금제 추천해드릴게요!
        </p>
      </motion.div>
    </div>
  );
}
