"use client"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import { Check, Calendar, Droplets, MessageSquare, HelpCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { QuizModal } from "@/components/quiz-modal"

interface DailyMissionProps {
  onWater: () => void
}

export function DailyMissions({ onWater }: DailyMissionProps) {
  const { isDarkMode } = useTheme()
  const { dailyActivities, markActivityComplete } = usePlant()
  const [showOXQuiz, setShowOXQuiz] = useState(false)
  const [showLastLeafQuiz, setShowLastLeafQuiz] = useState(false)

  const handleOXQuizComplete = () => {
    markActivityComplete("quizOX")
  }

  const handleLastLeafQuizComplete = () => {
    markActivityComplete("quizLastLeaf")
  }

  const missions = [
    {
      id: "attendance",
      title: "출석 체크",
      description: "오늘 MODi에 방문하기",
      points: 5,
      icon: <Calendar className="w-4 h-4" />,
      completed: dailyActivities.attendance,
      action: () => markActivityComplete("attendance"),
      buttonText: "출석 체크하기",
    },
    {
      id: "water",
      title: "물 주기",
      description: "새싹에게 물을 주세요",
      points: 5,
      icon: <Droplets className="w-4 h-4" />,
      completed: dailyActivities.water,
      action: onWater,
      buttonText: "물 주기",
    },
    {
      id: "message",
      title: "감성 메시지",
      description: "가족에게 메시지 카드 보내기",
      points: 10,
      icon: <MessageSquare className="w-4 h-4" />,
      completed: dailyActivities.message,
      action: () => {},
      buttonText: "메시지 작성하기",
      link: "/family-space",
    },
    {
      id: "quizOX",
      title: "OX 퀴즈",
      description: "통신 상식 OX 퀴즈 풀기",
      points: 10,
      icon: <HelpCircle className="w-4 h-4" />,
      completed: dailyActivities.quizOX,
      action: () => setShowOXQuiz(true),
      buttonText: "퀴즈 풀기",
    },
    {
      id: "quizLastLeaf",
      title: "마지막잎새 퀴즈",
      description: "요금제 추천 퀴즈 풀기",
      points: 10,
      icon: <HelpCircle className="w-4 h-4" />,
      completed: dailyActivities.quizLastLeaf,
      action: () => setShowLastLeafQuiz(true),
      buttonText: "퀴즈 풀기",
    },
    {
      id: "allWatered",
      title: "모두 물주고 영양제 받기",
      description: "가족 모두가 물을 주면 영양제를 받아요",
      points: 0,
      icon: <Award className="w-4 h-4" />,
      completed: dailyActivities.allWatered,
      action: () => {},
      buttonText: "",
      special: true,
    },
  ]

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            className={`p-4 rounded-lg border ${
              mission.completed
                ? isDarkMode
                  ? "bg-gray-700 border-[#81C784]"
                  : "bg-[#F1F8E9] border-[#81C784]"
                : isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
            }`}
            whileHover={{ scale: mission.completed ? 1 : 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`${mission.completed ? "text-[#388E3C]" : isDarkMode ? "text-gray-400" : "text-gray-400"}`}
              >
                {mission.icon}
              </div>
              <Badge
                variant={mission.completed ? "secondary" : "default"}
                className={mission.completed ? "bg-[#81C784] text-white" : ""}
              >
                {mission.points > 0 ? `+${mission.points}점` : mission.special ? "보너스" : ""}
              </Badge>
            </div>
            <h4
              className={`font-medium mb-2 ${
                mission.completed ? (isDarkMode ? "text-gray-400" : "text-gray-500") : "text-[#388E3C]"
              }`}
            >
              {mission.title}
            </h4>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70 mb-3`}>
              {mission.description}
            </p>

            {mission.completed ? (
              <div className="flex items-center text-[#388E3C] text-sm font-medium">
                <Check className="w-4 h-4 mr-1" /> 완료됨
              </div>
            ) : mission.buttonText ? (
              mission.link ? (
                <Button size="sm" className="w-full bg-[#81C784] hover:bg-[#388E3C] text-white" asChild>
                  <a href={mission.link}>{mission.buttonText}</a>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-[#81C784] hover:bg-[#388E3C] text-white"
                  onClick={mission.action}
                >
                  {mission.buttonText}
                </Button>
              )
            ) : null}
          </motion.div>
        ))}
      </div>

      {/* Quiz Modals */}
      <QuizModal isOpen={showOXQuiz} onClose={() => setShowOXQuiz(false)} onComplete={handleOXQuizComplete} type="ox" />

      <QuizModal
        isOpen={showLastLeafQuiz}
        onClose={() => setShowLastLeafQuiz(false)}
        onComplete={handleLastLeafQuizComplete}
        type="lastLeaf"
      />
    </>
  )
}
