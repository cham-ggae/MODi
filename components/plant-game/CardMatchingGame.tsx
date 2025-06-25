"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, TreePine, Flower, Sprout, Sun, Cloud, Star, Heart, Zap, X } from "lucide-react";
import { planDetails } from "@/lib/survey-result-data";
import { usePlantGameStore } from '@/store/usePlantGameStore';
import { useAddPoint } from '@/hooks/plant';

interface CardItem {
  id: number;
  icon: React.ComponentType<any>;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardIcons = [
  { icon: Leaf, name: "잎" },
  { icon: TreePine, name: "나무" },
  { icon: Flower, name: "꽃" },
  { icon: Sprout, name: "새싹" },
  { icon: Sun, name: "태양" },
  { icon: Cloud, name: "구름" },
  { icon: Star, name: "별" },
  { icon: Heart, name: "하트" },
];

export function CardMatchingGame() {
  const isOpen = usePlantGameStore(s => s.showCardMatchingGame);
  const setIsOpen = usePlantGameStore(s => s.setShowCardMatchingGame);
  const { mutate: addPoint } = useAddPoint();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 게임 초기화
  useEffect(() => {
    if (isOpen) {
      initializeGame();
    }
  }, [isOpen]);

  const initializeGame = () => {
    // 8쌍의 카드 생성 (총 16장)
    const cardPairs = cardIcons
      .map((item, index) => [
        { id: index * 2, icon: item.icon, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, icon: item.icon, isFlipped: false, isMatched: false },
      ])
      .flat();

    // 카드 순서 섞기
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (cardId: number) => {
    if (isLocked || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // 두 번째 카드가 뒤집혔을 때
    if (newFlippedCards.length === 2) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      // 같은 아이콘인지 확인
      if (firstCard.icon === secondCard.icon) {
        // 매치 성공
        newCards[firstId].isMatched = true;
        newCards[secondId].isMatched = true;
        setCards(newCards);
        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);
        setFlippedCards([]);
        setIsLocked(false);

        // 모든 쌍을 찾았는지 확인
        if (newMatchedPairs === 8) {
          setTimeout(() => {
            setSelectedPlan(selectRandomPlan());
            setIsModalOpen(true);
          }, 500);
        }
      } else {
        // 매치 실패 - 카드 다시 뒤집기
        setTimeout(() => {
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const handleComplete = () => {
    addPoint({ activityType: 'lastleaf' });
    setIsOpen(false);
    // 필요하다면 추가 로직 실행
  };

  // 랜덤 요금제 선택
  const selectRandomPlan = () => {
    const planIds = Object.keys(planDetails).map(Number);
    const randomPlanId = planIds[Math.floor(Math.random() * planIds.length)];
    const selectedPlan = planDetails[randomPlanId];
    console.log("랜덤 요금제 선택:", randomPlanId, selectedPlan.name);
    return selectedPlan;
  };

  // 포인트 적립 핸들러
  const handleGetPoint = () => {
    setIsModalOpen(false);
    handleComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">🍃 오늘의 추천 요금제 찾기</h3>
          <p className="text-sm text-gray-600 mb-4">같은 그림의 짝을 찾아보세요!</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>이동: {moves}회</span>
            <span>완료: {matchedPairs}/8쌍</span>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="aspect-square"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`h-full cursor-pointer transition-all duration-300 ${card.isMatched
                  ? "bg-green-100 border-green-300"
                  : card.isFlipped
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                onClick={() => handleCardClick(index)}
              >
                <CardContent className="p-2 h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {card.isFlipped || card.isMatched ? (
                      <motion.div
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl text-gray-700"
                      >
                        <card.icon className="w-8 h-8" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl text-gray-400"
                      >
                        ❓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleComplete} variant="outline" className="flex-1">
            나가기
          </Button>
          <Button onClick={initializeGame} className="flex-1 bg-blue-600 hover:bg-blue-700">
            다시하기
          </Button>
        </div>
      </div>

      {/* 요금제 모달 */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-l font-bold text-gray-800">추천 요금제</h3>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-4">
              <Card className="relative bg-white rounded-2xl border-[1px] shadow-sm border-[#cccccc]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* 헤더 영역 */}
                    <div>
                      <p className="text-xs mb-2 uppercase tracking-wide text-[#5b85b1] font-semibold">
                        {selectedPlan.description}
                      </p>
                      <h3 className="text-l font-bold text-gray-900 leading-tight">
                        {selectedPlan.name}
                      </h3>
                    </div>

                    {/* 가격 영역 */}
                    <div className="flex justify-between items-end">
                      <div></div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{selectedPlan.price}</div>
                      </div>
                    </div>

                    {/* 혜택 영역 */}
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">📋 주요 혜택</p>
                      <p className="text-gray-600 leading-relaxed">{selectedPlan.benefit}</p>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="space-y-2">
                      <Button
                        className="w-full py-3 rounded-xl transition-all duration-300 bg-white border-2 border-[#53a2f5] text-[#53a2f5] hover:bg-[#eaf4fd]"
                        onClick={() => window.open(selectedPlan.link, "_blank")}
                      >
                        요금제 자세히 보기
                      </Button>
                      <Button
                        onClick={handleGetPoint}
                        className="w-full py-3 rounded-xl transition-all duration-300 !bg-[#53a2f5] hover:!bg-[#3069a6] text-white"
                      >
                        확인
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
