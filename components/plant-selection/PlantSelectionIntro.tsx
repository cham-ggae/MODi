import { motion } from "framer-motion";

export function PlantSelectionIntro() {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl mb-6"
      ></motion.div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        어떤 식물을 키울까요?🌱
      </h1>
      <p className="text-gray-600 dark:text-gray-300">가족과 함께 키울 식물을 선택해보세요</p>
    </div>
  );
}
