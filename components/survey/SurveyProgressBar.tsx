"use client";

interface SurveyProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function SurveyProgressBar({ currentStep, totalSteps }: SurveyProgressBarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="px-6 mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentStep} / {totalSteps}
        </span>
        <span className="text-sm text-green-600 dark:text-green-400 font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
