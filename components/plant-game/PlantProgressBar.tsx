interface ProgressProps {
  level: number;
  progress: number;
}

export function PlantProgressBar({ level, progress }: ProgressProps) {
  return (
    <div className="px-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">레벨 {level + 1} 더보기</span>
        <span className="text-sm font-bold text-blue-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-400 h-2 rounded-full"
          style={{ width: `${progress}%`, transition: "width 0.8s ease-out" }}
        />
      </div>
    </div>
  );
}
