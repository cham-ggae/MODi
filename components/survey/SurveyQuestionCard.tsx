"use client";

export interface Option {
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
    <div className="w-full h-full flex flex-col p-4">
      <h1
        className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center flex-shrink-0 leading-tight
        [@media(max-width:389px)]:text-base [@media(max-width:389px)]:mb-2"
      >
        {question.question}
      </h1>

      <div
        className="space-y-4 flex-1 flex flex-col justify-center
        [@media(max-width:389px)]:space-y-2"
      >
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value)}
            className="w-full p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl flex items-center space-x-4 hover:border-green-400 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200
              [@media(max-width:389px)]:p-3 [@media(max-width:389px)]:space-x-2"
          >
            <div
              className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl
              [@media(max-width:389px)]:w-9 [@media(max-width:389px)]:h-9 [@media(max-width:389px)]:text-xl"
            >
              {option.emoji}
            </div>
            <span
              className="text-lg font-medium text-gray-900 dark:text-white text-left
              [@media(max-width:389px)]:text-sm"
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
