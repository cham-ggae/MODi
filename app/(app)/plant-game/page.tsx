"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { FamilyWateringStatus } from "@/components/plant-game/FamilyWateringStatus"; //
import { PlantImageDisplay } from "@/components/plant-game/PlantImageDisplay";
import { PlantProgressBar } from "@/components/plant-game/PlantProgressBar";
import { PlantActionButtons } from "@/components/plant-game/PlantActionButtons";
import { MissionSheet } from "@/components/plant-game/MissionSheet";
import { FamilyMember, Mission } from "@/types/plant-game.type";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFamily } from "@/hooks/family";

export default function PlantGamePage() {
  const [selectedPlantType, setSelectedPlantType] = useState<"flower" | "tree" | null>(null);
  const [showMissions, setShowMissions] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(26);
  const [isWatering, setIsWatering] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);

  // 예시 데이터: 실제 데이터로 교체 필요
  const members: FamilyMember[] = [
    { id: 1, name: "엄마", avatar: "🖼️", hasWatered: true, status: "물주기 완료" },
    { id: 2, name: "아빠", avatar: "👤", hasWatered: false, status: "" },
    { id: 3, name: "나", avatar: "👤", hasWatered: true, status: "물주기 완료" },
  ];
  const waterCooldownText = "5시간 59분 후";
  const nutrientCount = 1;

  const missions: Mission[] = [
    {
      id: 1,
      title: "더 받을 수 있는 영양제 2개",
      description: "미션 매일 밤 12시에 다시 시작됩니다.",
      icon: "✏️",
      reward: "영양제 1개",
    },
    {
      id: 2,
      title: "매일 응답받기",
      description: "미션 참여하고 좋은 반응요",
      icon: "🏆",
      reward: "영양제 1개",
    },
    {
      id: 3,
      title: "신용카드 캐시백",
      description: "아빠만 최대 77.9만원",
      icon: "💳",
      reward: "영양제 1개",
    },
  ];

  const { familyId } = useFamily();

  useEffect(() => {
    // localStorage에서 선택된 식물 타입과 레벨 정보 가져오기
    const plantType = localStorage.getItem("selectedPlantType") as "flower" | "tree" | null;
    const level = Number.parseInt(localStorage.getItem("plantLevel") || "1");
    const progress = Number.parseInt(localStorage.getItem("plantProgress") || "26");
    setSelectedPlantType(plantType);
    setCurrentLevel(level);
    setCurrentProgress(progress);
  }, []);

  const handleWatering = () => {
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 2000);
  };
  const handleFeeding = () => {
    setIsFeeding(true);
    setTimeout(() => setIsFeeding(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <Link href="/family-space">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-lg font-semibold text-center w-full text-gray-900">새싹 키우기</h1>
        <Button
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-4 py-2 text-sm"
          onClick={() => setShowMissions(true)}
        >
          미션하기
        </Button>
      </div>

      {/* Family Status */}
      <FamilyWateringStatus members={members} />

      {/* Plant Image & Animation */}
      <PlantImageDisplay
        selectedPlantType={selectedPlantType}
        currentLevel={currentLevel}
        isWatering={isWatering}
        isFeeding={isFeeding}
      />

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <PlantProgressBar level={currentLevel} progress={currentProgress} />
        <PlantActionButtons
          onWater={handleWatering}
          onFeed={handleFeeding}
          waterCooldownText={waterCooldownText}
          nutrientCount={nutrientCount}
        />
      </div>

      {/* Mission Sheet */}
      <AnimatePresence>
        {showMissions && (
          <MissionSheet missions={missions} onClose={() => setShowMissions(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
