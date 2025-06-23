import { motion } from "framer-motion";
import Image from "next/image";

interface PlantOptionCardProps {
  plant: { id: string; name: string; description: string; image: string };
  selected: boolean;
  onSelect: (id: "flower" | "tree") => void;
}

export function PlantOptionCard({ plant, selected, onSelect }: PlantOptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative cursor-pointer transition-all duration-200 rounded-2xl p-6 border-2 flex flex-col items-center h-full
        ${
          selected
            ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
        }
      `}
      onClick={() => onSelect(plant.id as "flower" | "tree")}
    >
      <div className="relative w-[96px] h-[96px] mb-4">
        <Image
          src={plant.image || "/placeholder.svg"}
          alt={plant.name}
          fill
          priority
          className="object-contain drop-shadow-sm"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plant.name}</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">{plant.description}</p>
    </motion.div>
  );
}
