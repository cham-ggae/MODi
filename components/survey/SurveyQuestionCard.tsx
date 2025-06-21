"use client";

import { motion } from "framer-motion";

interface Option {
  emoji: string;
  label: string;
  value: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface SurveyQuestionCardProps {
  question: Question;
  onAnswer: (value: string) => void;
}

export function SurveyQuestionCard({ question, onAnswer }: SurveyQuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">
        {question.question}
      </h1>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAnswer(option.value)}
            className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-3xl flex items-center space-x-4 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
              {option.emoji}
            </div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
