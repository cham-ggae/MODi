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
        cursor-pointer transition-all duration-200 rounded-2xl p-6 border-2
        ${
          selected
            ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
        }
      `}
      onClick={() => onSelect(plant.id as "flower" | "tree")}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Image
            src={plant.image || "/placeholder.svg"}
            alt={plant.name}
            width={80}
            height={80}
            className="drop-shadow-sm"
          />
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plant.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{plant.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
