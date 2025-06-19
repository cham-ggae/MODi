import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  selectedPlantType: "flower" | "tree" | null;
  currentLevel: number;
  isWatering: boolean;
  isFeeding: boolean;
}

export function PlantImageDisplay({
  selectedPlantType,
  currentLevel,
  isWatering,
  isFeeding,
}: Props) {
  const getCurrentPlantImage = () => {
    if (!selectedPlantType) return null;
    const level = Math.min(Math.max(currentLevel, 1), 5);
    return `/images/${selectedPlantType}${level}.png`;
  };
  const plantImage = getCurrentPlantImage();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {plantImage ? (
        <motion.div
          key={currentLevel}
          animate={{
            rotate: [0, 5, -5, 0],
            scale: isWatering || isFeeding ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            scale: { duration: 0.5 },
          }}
          className="flex justify-center"
        >
          <Image
            src={plantImage || "/placeholder.svg"}
            alt={`${selectedPlantType} 레벨 ${currentLevel}`}
            width={300}
            height={300}
            className="object-contain"
          />
        </motion.div>
      ) : (
        <div className="text-8xl">🌱</div>
      )}
      {/* Water Animation */}
      <AnimatePresence>
        {isWatering && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 50 }}
            exit={{ opacity: 0 }}
            className="absolute text-4xl"
          >
            💧💧💧
          </motion.div>
        )}
      </AnimatePresence>
      {/* Feed Animation */}
      <AnimatePresence>
        {isFeeding && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute text-4xl"
          >
            ✨⭐✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
