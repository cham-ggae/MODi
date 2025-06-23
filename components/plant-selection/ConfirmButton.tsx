import { Button } from "@/components/ui/button";
import { Flower, TreePine } from "lucide-react";

interface ConfirmButtonProps {
  selectedPlant: "flower" | "tree" | null;
  onClick: () => void;
}

export function ConfirmButton({ selectedPlant, onClick }: ConfirmButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={!selectedPlant}
      className="w-full bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {selectedPlant ? (
        <>
          {selectedPlant === "flower" ? (
            <Flower className="w-5 h-5 mr-2" />
          ) : (
            <TreePine className="w-5 h-5 mr-2" />
          )}
          {selectedPlant === "flower" ? "꽃" : "나무"} 키우기 시작!
        </>
      ) : (
        "식물을 선택해주세요"
      )}
    </Button>
  );
}
