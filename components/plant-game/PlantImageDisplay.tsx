import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import wateringAnimation from "../../public/animations/watering.json";
import nutrientAnimation from "../../public/animations/nutrient.json";

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

  // 이전 레벨 저장용 훅
  function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {plantImage ? (
          <motion.div
            key={plantImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: isWatering || isFeeding ? [1, 1.1, 1] : 1,
              rotate: [0, 5, -5, 0],
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.5 },
              rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative w-full h-full max-w-sm"
          >
            <Image
              src={plantImage}
              alt={`${selectedPlantType} 레벨 ${currentLevel}`}
              fill
              priority
              className="object-contain"
            />
            {/* Water Effect */}
            {isWatering && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  zIndex: 10
                }}
              >
                <Lottie
                  animationData={wateringAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </div>
            )}

            {/* Nutrient Effect */}
            {isFeeding && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  zIndex: 10
                }}
              >
                <Lottie
                  animationData={nutrientAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="seed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-8xl"
          >
            🌱
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
