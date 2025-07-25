import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, TreePine, Flower, Leaf, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlantType } from "@/types/family.type";
import { PlantStatus } from "@/types/plants.type";
import { Skeleton } from "@/components/ui/skeleton";

interface PlantSectionProps {
  plant: {
    hasPlant: boolean;
    level?: number;
    plantType?: PlantType;
    canCreateNew: boolean;
    createBlockReason?: string;
  };

  plantStatus?: PlantStatus | null;

  onPlantAction: () => void;
  familyNutrial?: number;
  familyDaysAfterCreation?: number;
  isPlantStatusLoading?: boolean;
}

export function PlantSection({
  plant,
  plantStatus,
  onPlantAction,
  familyNutrial = 0,
  familyDaysAfterCreation = 0,
  isPlantStatusLoading = false,
}: PlantSectionProps) {
  const { hasPlant, plantType, canCreateNew, createBlockReason } = plant;

  return (
    <div className="text-center py-8">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="mb-6"
      >
        {hasPlant && plantType ? (
          <div className="w-24 h-24 mx-auto">
            <Image
              src={plantType === "flower" ? "/images/flower5.png" : "/images/tree5.png"}
              alt={plantType === "flower" ? "꽃" : "나무"}
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        ) : (
          <div className="text-6xl">🌱</div>
        )}
      </motion.div>

      {/* 항상 버튼 표시, 조건에 따라 비활성화만 처리 */}
      <Button
        onClick={onPlantAction}
        disabled={isPlantStatusLoading || (!hasPlant && !canCreateNew)}
        className={
          isPlantStatusLoading
            ? "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full px-8 py-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            : hasPlant && plantStatus && !plantStatus.completed
            ? "bg-[#5bc236] text-white rounded-full px-8 py-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full px-8 py-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {isPlantStatusLoading ? (
          <>
            <Sprout className="w-4 h-4 mr-2 animate-pulse" />
            로딩중...
          </>
        ) : hasPlant ? (
          plantStatus && !plantStatus.completed ? (
            <>
              <TreePine className="w-4 h-4 mr-2" />
              새싹 키우기
            </>
          ) : (
            <>
              <Sprout className="w-4 h-4 mr-2" />새 식물 만들기
            </>
          )
        ) : canCreateNew ? (
          <>
            <Sprout className="w-4 h-4 mr-2" />
            새싹 만들기
          </>
        ) : (
          <>
            <Sprout className="w-4 h-4 mr-2" />
            가족 초대 필요
          </>
        )}
      </Button>

      {/* 생성 차단 사유 표시 */}
      {!canCreateNew && !hasPlant && createBlockReason && (
        <div className="mt-3 text-center">
          <Badge
            variant="destructive"
            className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {createBlockReason}
          </Badge>
        </div>
      )}

      {(familyNutrial > 0 || familyDaysAfterCreation > 0) && (
        <div className="flex justify-center gap-4 mt-4">
          {/* {familyNutrial > 0 && (
            <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300">
              <Leaf className="w-3 h-3 mr-1" />
              영양제 {familyNutrial}개
            </Badge>
          )} */}
          {familyDaysAfterCreation > 0 && (
            <Badge className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-300">
              {familyDaysAfterCreation}일째 함께
            </Badge>
          )}
        </div>
      )}

      {hasPlant && plantType && (
        <div className="text-center mt-3">
          {/* <Badge className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-100 text-gray-500 dark:text-gray-500">
            {plantType === "flower" ? (
              <>
                <Flower className="w-3 h-3 mr-1" />
                꽃이 피어나고 있어요
              </>
            ) : (
              <>
                <TreePine className="w-3 h-3 mr-1" />
                나무가 자라나고 있어요
              </>
            )}
          </Badge> */}
        </div>
      )}
    </div>
  );
}
