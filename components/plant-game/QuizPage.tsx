import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Brain, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QuizPageProps {
  onBack: () => void;
  onQuizComplete: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 정답 인덱스 (0-3)
  explanation: string;
}

interface QuizResult {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export function QuizPage({ onBack, onQuizComplete }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30초 제한
  const [timerActive, setTimerActive] = useState(true);

  // 통신 관련 퀴즈 문제들 (12개)
  const allQuizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "너깃 69/65 요금제 가입 시 제공되는 OTT 혜택은 무엇인가요?",
      options: [
        "넷플릭스 무료 이용",
        "티빙 + 디즈니+ 스탠다드",
        "유튜브 프리미엄 제공",
        "왓챠 + 웨이브 무료",
      ],
      correctAnswer: 1,
      explanation:
        "너깃 69/65 요금제는 티빙 베이직 + 디즈니 플러스 스탠다드 월정액을 무료 제공합니다.",
    },
    {
      id: 2,
      question: "너깃패스/너깃쿠폰 혜택을 받을 수 있는 최소 요금제는?",
      options: [
        "월 49,000원 이상 요금제",
        "월 59,000원 이상 요금제",
        "월 69,000원 이상 요금제",
        "모든 요금제",
      ],
      correctAnswer: 1,
      explanation: "너깃패스는 59,000원 이상 너깃 요금제를 사용할 경우 받을 수 있는 혜택입니다.",
    },
    {
      id: 3,
      question: "너깃 요금제(59 이상) 이용자에게 제공되는 혜택이 아닌 것은?",
      options: [
        "매달 U+멤버십 VIP 무료",
        "네이버페이/포인트/콘텐츠 쿠폰 선택",
        "기기변경 시 에어팟 프로 무조건 무료",
        "최초 가입 시 멀티무제한 듣기 선택 가능",
      ],
      correctAnswer: 2,
      explanation: "기기변경 시 일부 혜택은 기기와 조건에 따라 다르며, 무조건 무료는 아닙니다.",
    },
    {
      id: 4,
      question: "참 쉬운 가족 결합으로 휴대폰 3회선 결합 시 최대 얼마까지 절감 가능한가요?",
      options: ["월 6,600원", "월 10,000원", "월 20,460원", "월 33,660원"],
      correctAnswer: 3,
      explanation: "3회선 결합 시 최대 월 33,660원의 할인이 가능합니다.",
    },
    {
      id: 5,
      question: "참 쉬운 가족 결합은 최대 몇 명까지 결합 가능한가요? (휴대폰 기준)",
      options: ["3명", "5명", "7명", "10명"],
      correctAnswer: 3,
      explanation: "참 쉬운 가족 결합으로 휴대폰은 최대 10회선까지 결합 가능합니다.",
    },
    {
      id: 6,
      question: "휴대폰 4~5명을 결합하면 1인당 얼마의 할인을 받을 수 있나요?",
      options: ["10,000원", "14,000원", "18,000원", "20,000원"],
      correctAnswer: 3,
      explanation: "4~5명 결합 시 1인당 월 20,000원의 할인을 받을 수 있습니다.",
    },
    {
      id: 7,
      question: "모바일 이용기간이 4년 이상인 경우 받을 수 있는 데이터 쿠폰 수는?",
      options: ["2장", "4장", "6장", "8장"],
      correctAnswer: 2,
      explanation: "모바일 이용기간이 4년 이상이면 매년 2GB 쿠폰 6장을 받을 수 있습니다.",
    },
    {
      id: 8,
      question: "모바일 이용기간 2년 이상일 경우 받을 수 있는 데이터 쿠폰 수는?",
      options: ["2장", "4장", "6장", "8장"],
      correctAnswer: 1,
      explanation: "2년 이상 사용 시 2GB 쿠폰 4장을 받을 수 있습니다.",
    },
    {
      id: 9,
      question: "LTE 데이터 기본 제공량 초과 시 요금은?",
      options: ["약 10원/MB", "약 19.8원/MB", "약 22.53원/MB", "약 281.6원/MB"],
      correctAnswer: 2,
      explanation: "LTE 데이터 33 요금제 기준 초과 요금은 22.53원/MB입니다.",
    },
    {
      id: 10,
      question: "'5G 프리미어 에센셜' 요금제의 테더링·쉐어링 제공량은?",
      options: ["50GB", "60GB", "70GB", "무제한"],
      correctAnswer: 2,
      explanation: "5G 프리미어 에센셜 요금제는 테더링/쉐어링 70GB를 제공합니다.",
    },
    {
      id: 11,
      question: "U+투게더 청소년 할인은 어떤 조건일 때 제공되나요?",
      options: [
        "만 18세 이상 대학생 자녀",
        "구성원 중 만 19세 이하 청소년이 있는 경우",
        "5인 가족 이상 구성 시",
        "가족 모두 동일 요금제 이용 시",
      ],
      correctAnswer: 1,
      explanation: "만 19세 이하 청소년이 있는 구성원에게는 월 1만원 추가 할인이 제공됩니다.",
    },
    {
      id: 12,
      question: "5G 시그니처 요금제 이용 시 자녀에게 제공되는 할인 혜택은?",
      options: [
        "자녀 요금제 무제한 데이터 제공",
        "자녀 1인당 월 최대 33,000원 할인",
        "가족 전체 무선요금 50% 할인",
        "U+멤버십 포인트 2배 적립",
      ],
      correctAnswer: 1,
      explanation: "5G 시그니처 요금제 이용 시 자녀 요금에서 최대 월 33,000원까지 할인됩니다.",
    },
  ];

  // 12개 문제 중에서 랜덤으로 3개 선택
  const [quizQuestions, setQuizQuestions] = useState(() => {
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  // 타이머 관리
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult && !isQuizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // 시간 초과 시 자동으로 다음 문제로
      handleTimeUp();
    }
  }, [timeLeft, timerActive, showResult, isQuizCompleted]);

  // 시간 초과 처리
  const handleTimeUp = () => {
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: -1, // 시간 초과 표시
      isCorrect: false,
    };

    setQuizResults((prev) => [...prev, result]);
    setSelectedAnswer(-1);
    setShowResult(true);
    setTimerActive(false);
  };

  // 답안 선택
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || isQuizCompleted) return;

    setSelectedAnswer(answerIndex);
    setTimerActive(false);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
    };

    setQuizResults((prev) => [...prev, result]);
    setShowResult(true);
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      // 퀴즈 완료
      setIsQuizCompleted(true);
    }
  };

  // 퀴즈 재시작
  const handleRestartQuiz = () => {
    // 새로운 랜덤 문제 선택
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    const newQuizQuestions = shuffled.slice(0, 3);

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizResults([]);
    setIsQuizCompleted(false);
    setTimeLeft(30);
    setTimerActive(true);

    // 새로운 문제로 교체
    setQuizQuestions(newQuizQuestions);
  };

  // 퀴즈 완료 및 미션 완료
  const handleCompleteQuiz = () => {
    onQuizComplete();
    onBack();
  };

  // 점수 계산
  const correctAnswers = quizResults.filter((result) => result.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / quizQuestions.length) * 100);

  // 결과 메시지
  const getResultMessage = () => {
    if (scorePercentage >= 80)
      return { message: "훌륭해요! 통신 전문가네요! 🎉", color: "text-green-600" };
    if (scorePercentage >= 60)
      return { message: "잘했어요! 조금 더 공부하면 완벽해요! 👍", color: "text-blue-600" };
    if (scorePercentage >= 40)
      return { message: "괜찮아요! 다시 도전해보세요! 💪", color: "text-yellow-600" };
    return { message: "아직 부족해요. 다시 한번 도전해보세요! 📚", color: "text-red-600" };
  };

  if (isQuizCompleted) {
    const resultMessage = getResultMessage();

    return (
      <div className="h-full w-full relative overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 max-w-md mx-auto">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between p-4 pt-12 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <span className="text-gray-800 font-medium">퀴즈 결과</span>
          </div>
        </div>

        {/* 결과 화면 */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">퀴즈 완료!</h2>
          <p className={`text-base font-medium mb-4 ${resultMessage.color}`}>
            {resultMessage.message}
          </p>

          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-lg mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {correctAnswers}/{quizQuestions.length}
              </div>
              <div className="text-gray-600 mb-3 text-sm">정답 개수</div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">{scorePercentage}% 정답률</div>
            </div>
          </div>

          <div className="space-y-2 w-full max-w-xs">
            <Button
              onClick={handleCompleteQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium text-sm"
            >
              미션 완료하기
            </Button>

            <Button
              onClick={handleRestartQuiz}
              variant="outline"
              className="w-full py-2 rounded-xl font-medium border-gray-300 hover:bg-gray-50 text-sm"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              다시 도전하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 max-w-md mx-auto">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between p-4 pt-12 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <span className="text-gray-800 font-medium">통신 퀴즈</span>
        </div>

        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 font-medium text-sm">10점</span>
        </div>
      </div>

      {/* 진행률 및 타이머 */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">
            {currentQuestionIndex + 1}/{quizQuestions.length}
          </span>
          <div
            className={`flex items-center space-x-1 ${
              timeLeft <= 10 ? "text-red-600" : "text-gray-600"
            }`}
          >
            <span className="text-xs font-medium">{timeLeft}초</span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 bg-white/50" />
      </div>

      {/* 퀴즈 내용 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => {
                let buttonClass =
                  "w-full p-3 text-left rounded-lg border-2 transition-all duration-200 text-sm ";

                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-700";
                  } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-700";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "border-blue-500 bg-blue-50 text-blue-700";
                  } else {
                    buttonClass +=
                      "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {showResult &&
                        index === selectedAnswer &&
                        index !== currentQuestion.correctAnswer && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 시간 초과 메시지 */}
            {showResult && selectedAnswer === -1 && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-xs font-medium">⏰ 시간 초과되었습니다!</p>
              </div>
            )}

            {/* 정답 설명 */}
            {showResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">💡 설명</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* 다음 버튼 */}
            {showResult && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? "다음 문제" : "결과 보기"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
