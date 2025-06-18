"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { usePlant } from "@/contexts/plant-context"
import Image from "next/image"

export function PlantTypeSelector() {
  const { isDarkMode } = useTheme()
  const { selectPlant } = usePlant()
  const [selectedType, setSelectedType] = useState<"flower" | "tree" | null>(null)

  const handleSelect = (type: "flower" | "tree") => {
    setSelectedType(type)
  }

  const handleConfirm = () => {
    if (selectedType) {
      selectPlant(selectedType)
    }
  }

  const plantTypes = [
    {
      id: "flower" as const,
      name: "꽃",
      description: "아름다운 꽃을 피워보세요",
      emoji: "🌸",
      image: "/images/flower-complete.png",
      color: "from-pink-200 to-blue-200",
      darkColor: "from-pink-900/40 to-blue-900/40",
    },
    {
      id: "tree" as const,
      name: "나무",
      description: "튼튼한 나무로 키워보세요",
      emoji: "🌳",
      image: "/images/tree-complete.png",
      color: "from-green-200 to-yellow-200",
      darkColor: "from-green-900/40 to-yellow-900/40",
    },
  ]

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
          어떤 식물을 키우고 싶나요?
        </h2>
        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70`}>
          가족과 함께 키울 식물을 선택해주세요
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plantTypes.map((plant) => (
          <motion.div
            key={plant.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => handleSelect(plant.id)}
          >
            <Card
              className={`
                border-2 transition-all duration-300 h-full
                ${
                  selectedType === plant.id
                    ? "border-[#388E3C] shadow-lg scale-105"
                    : isDarkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-[#81C784]"
                }
                ${isDarkMode ? "bg-gray-800" : "bg-white"}
              `}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`
                    w-full h-64 rounded-lg mb-6 flex items-center justify-center
                    bg-gradient-to-br ${isDarkMode ? plant.darkColor : plant.color}
                  `}
                >
                  <Image
                    src={plant.image || "/placeholder.svg"}
                    alt={plant.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>

                <div className="text-4xl mb-4">{plant.emoji}</div>
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
                  {plant.name}
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70 mb-6`}>
                  {plant.description}
                </p>

                {selectedType === plant.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-8 h-8 bg-[#388E3C] rounded-full flex items-center justify-center mx-auto"
                  >
                    <span className="text-white text-lg">✓</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedType && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Button onClick={handleConfirm} className="bg-[#81C784] hover:bg-[#388E3C] text-white px-8 py-3 text-lg">
            {selectedType === "flower" ? "🌸" : "🌳"} {plantTypes.find((p) => p.id === selectedType)?.name} 키우기 시작!
          </Button>
        </motion.div>
      )}
    </div>
  )
}
