"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { PlantSelectionHeader } from "@/components/plant-selection/PlantSelectionHeader";
import { PlantSelectionIntro } from "@/components/plant-selection/PlantSelectionIntro";
import { PlantOptionCard } from "@/components/plant-selection/PlantOptionCard";
import { ConfirmButton } from "@/components/plant-selection/ConfirmButton";
import { useCreatPlant } from "@/hooks/plant/useCreatePlant"; //  훅 이름 그대로 사용
import { useFamily } from "@/hooks/family"; //  familyId 가져오기

const plantOptions = [
  {
    id: "flower",
    name: "꽃",
    description: "아름다운 꽃을 피워보세요",
    image: "/images/flower5.png",
  },
  {
    id: "tree",
    name: "나무",
    description: "튼튼한 나무를 길러보세요",
    image: "/images/tree5.png",
  },
];

export default function PlantSelectionPage() {
  const [selectedPlant, setSelectedPlant] = useState<"flower" | "tree" | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createPlant } = useCreatPlant(); // ✅ 훅 사용
  const { familyId } = useFamily(); // ✅ familyId 필요

  const handlePlantSelect = (plantType: "flower" | "tree") => {
    setSelectedPlant(plantType);
  };

  const handleConfirm = () => {
    if (!selectedPlant) {
      toast({
        title: "식물을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!familyId) {
      toast({
        title: "가족 정보가 없습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    // ✅ FormData 생성 및 append
    const formData = new FormData();
    formData.append("plantType", selectedPlant); // enum 문자열
    formData.append("fid", String(familyId)); // 숫자 ⇒ 문자열

    createPlant(formData, {
      onSuccess: () => {
        toast({
          title: "새싹이 생성되었습니다 🌱",
          description: "이제 식물을 키워보세요!",
        });
        router.push("/plant-game");
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 max-w-md mx-auto">
      <PlantSelectionHeader />
      <div className="p-6">
        <PlantSelectionIntro />
        <div className="space-y-4 mb-12">
          {plantOptions.map((plant, index) => (
            <PlantOptionCard
              key={plant.id}
              plant={plant}
              selected={selectedPlant === plant.id}
              onSelect={handlePlantSelect}
            />
          ))}
        </div>
        <ConfirmButton selectedPlant={selectedPlant} onClick={handleConfirm} />
      </div>
    </div>
  );
}
