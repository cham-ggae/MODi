"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface PlantTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PlantTypeModal({ isOpen, onClose }: PlantTypeModalProps) {
  const [selectedType, setSelectedType] = useState<"flower" | "tree" | null>(null)
  const router = useRouter()

  const handleSelect = (type: "flower" | "tree") => {
    setSelectedType(type)
  }

  const handleConfirm = () => {
    if (selectedType) {
      // 선택된 식물 타입을 localStorage에 저장
      localStorage.setItem("selectedPlantType", selectedType)
      onClose()
      router.push("/plant-game")
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
    },
    {
      id: "tree" as const,
      name: "나무",
      description: "튼튼한 나무로 키워보세요",
      emoji: "🌳",
      image: "/images/tree-complete.png",
      color: "from-green-200 to-yellow-200",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-600">어떤 식물을 키우고 싶나요?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <p className="text-center text-gray-600 mb-6">가족과 함께 키울 식물을 선택해주세요</p>

          <div className="space-y-4">
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
                    border-2 transition-all duration-300
                    ${
                      selectedType === plant.id
                        ? "border-green-500 shadow-lg scale-105"
                        : "border-gray-200 hover:border-green-300"
                    }
                  `}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`
                        w-full h-32 rounded-lg mb-4 flex items-center justify-center
                        bg-gradient-to-br ${plant.color}
                      `}
                    >
                      <div className="text-4xl">{plant.emoji}</div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-gray-900">{plant.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plant.description}</p>

                    {selectedType === plant.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                      >
                        <span className="text-white text-sm">✓</span>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedType && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
              <Button onClick={handleConfirm} className="w-full bg-green-500 hover:bg-green-600 text-white py-3">
                {selectedType === "flower" ? "🌸" : "🌳"} {plantTypes.find((p) => p.id === selectedType)?.name} 키우기
                시작!
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
