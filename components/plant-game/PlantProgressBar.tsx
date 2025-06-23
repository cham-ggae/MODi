import { Leaf } from "lucide-react";
import { useNutrientStatus, usePlantStatus } from "@/hooks/plant";

interface ProgressProps {
  level: number;
  progress: number;
  fid: number;
}

export function PlantProgressBar({ level, progress, fid }: ProgressProps) {
  // 영양제 개수를 직접 API에서 가져오기
  const { data: nutrientCount = 0 } = useNutrientStatus();
  const { data: plantStatus } = usePlantStatus(fid);

  const calculatedProgress =
    !progress && plantStatus
      ? Math.floor((plantStatus.experiencePoint / plantStatus.expThreshold) * 100)
      : progress;
  console.log(calculatedProgress);

  return (
    <div className="px-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">레벨 {level}</span>
          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            <Leaf className="w-3 h-3" />
            영양제 {nutrientCount}개
          </div>
        </div>
        <span className="text-lg font-bold text-blue-500">{calculatedProgress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-400 h-2 rounded-full transition-all duration-800 ease-out"
          style={{ width: `${calculatedProgress}%` }}
        />
      </div>
    </div>
  );
}
