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

  // 통신 관련 퀴즈 문제들 (3개)
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "5G 네트워크의 최대 이론 속도는 얼마인가요?",
      options: ["1Gbps", "10Gbps", "20Gbps", "100Gbps"],
      correctAnswer: 2,
      explanation:
        "5G의 최대 이론 속도는 20Gbps입니다. 하지만 실제 환경에서는 1-3Gbps 정도가 일반적입니다.",
    },
    {
      id: 2,
      question: "LTE와 5G의 가장 큰 차이점은 무엇인가요?",
      options: ["속도만 빠름", "배터리 소모가 적음", "초저지연과 대규모 연결", "요금이 저렴함"],
      correctAnswer: 2,
      explanation:
        "5G는 LTE 대비 속도뿐만 아니라 1ms 수준의 초저지연과 평방킬로미터당 100만 개 기기 연결이 가능합니다.",
    },
    {
      id: 3,
      question: "무제한 요금제에서 '속도 제한'이 걸리는 기준은 보통 얼마인가요?",
      options: ["10GB", "30GB", "50GB", "100GB"],
      correctAnswer: 3,
      explanation: "대부분의 통신사에서 무제한 요금제는 100GB 사용 후 속도가 제한됩니다.",
    },
  ];

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
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizResults([]);
    setIsQuizCompleted(false);
    setTimeLeft(30);
    setTimerActive(true);
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
