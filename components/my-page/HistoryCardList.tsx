import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function HistoryCardList({ items }: { items: any[] }) {
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((result, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                  {result.type}
                </Badge>
                <span className="text-xs text-gray-400">{result.date}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{result.description}</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                추천: {result.recommendedPlan}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
