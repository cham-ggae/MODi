"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flower, TreePine } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePlantStatus } from "@/hooks/use-plant-status"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const plantOptions = [
  {
    id: "flower",
    name: "꽃",
    description: "아름다운 꽃을 피워보세요",
    image: "/images/flower5.png",
  },
  {
    id: "tree",
    name: "나무",
    description: "튼튼한 나무를 길러보세요",
    image: "/images/tree5.png",
  },
]

export default function PlantSelectionPage() {
  const [selectedPlant, setSelectedPlant] = useState<"flower" | "tree" | null>(null)
  const { createPlant } = usePlantStatus()
  const router = useRouter()
  const { toast } = useToast()

  const handlePlantSelect = (plantType: "flower" | "tree") => {
    setSelectedPlant(plantType)
  }

  const handleConfirm = () => {
    if (!selectedPlant) {
      toast({
        title: "식물을 선택해주세요",
        variant: "destructive",
      })
      return
    }

    createPlant(selectedPlant)
    toast({
      title: "새싹이 생성되었습니다! 🌱",
      description: "이제 가족과 함께 키워보세요!",
    })

    router.push("/plant-game")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/family-space">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">새싹 만들기</h1>
        <div className="w-6 h-6" />
      </div>

      <div className="p-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl mb-6"
          >
            🌱
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">어떤 식물을 키울까요?</h2>
          <p className="text-gray-600 dark:text-gray-300">가족과 함께 키울 식물을 선택해보세요</p>
        </div>

        <div className="space-y-4 mb-12">
          {plantOptions.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                cursor-pointer transition-all duration-200 rounded-2xl p-6 border-2
                ${
                  selectedPlant === plant.id
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
              onClick={() => handlePlantSelect(plant.id as "flower" | "tree")}
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
                  {selectedPlant === plant.id && (
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
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={handleConfirm}
            disabled={!selectedPlant}
            className="w-full bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {selectedPlant ? (
              <>
                {selectedPlant === "flower" ? (
                  <Flower className="w-5 h-5 mr-2" />
                ) : (
                  <TreePine className="w-5 h-5 mr-2" />
                )}
                {selectedPlant === "flower" ? "꽃" : "나무"} 키우기 시작!
              </>
            ) : (
              "식물을 선택해주세요"
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
