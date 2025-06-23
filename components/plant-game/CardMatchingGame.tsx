"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  TreePine,
  Flower,
  Sprout,
  Sun,
  Cloud,
  Star,
  Heart,
  CheckCircle,
  Zap,
} from "lucide-react";

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

interface CardMatchingGameProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function CardMatchingGame({ isOpen, onClose, onComplete }: CardMatchingGameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

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
    setShowResult(false);
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
        setMatchedPairs((prev) => prev + 1);
        setFlippedCards([]);
        setIsLocked(false);

        // 모든 쌍을 찾았는지 확인
        if (matchedPairs + 1 === 8) {
          setTimeout(() => {
            setShowResult(true);
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
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {!showResult ? (
          <>
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
                    className={`h-full cursor-pointer transition-all duration-300 ${
                      card.isMatched
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
              <Button onClick={onClose} variant="outline" className="flex-1">
                나가기
              </Button>
              <Button onClick={initializeGame} className="flex-1 bg-blue-600 hover:bg-blue-700">
                다시하기
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 완료!</h3>
              <p className="text-gray-600 mb-4">모든 짝을 찾았습니다!</p>
            </motion.div>

            {/* 요금제 정보 api 연동해서 결과 나오게...*/}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">오늘의 추천 요금제!!</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 월 29,000원</p>
                  <p>• 데이터 무제한</p>
                  <p>• 통화 무제한</p>
                  <p>• 문자 무제한</p>
                  <p>• 가족 구성원 4명까지 추가 가능</p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
              완료!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
