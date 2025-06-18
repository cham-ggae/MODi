"use client"

import { useState, useEffect } from "react"

export function usePlantStatus() {
  const [hasPlant, setHasPlant] = useState(false)
  const [plantType, setPlantType] = useState<"flower" | "tree" | null>(null)
  const [plantLevel, setPlantLevel] = useState(1)

  useEffect(() => {
    // localStorage에서 식물 상태 확인
    const plantExists = localStorage.getItem("hasPlant") === "true"
    const savedPlantType = localStorage.getItem("selectedPlantType") as "flower" | "tree" | null
    const savedLevel = Number.parseInt(localStorage.getItem("plantLevel") || "1")

    setHasPlant(plantExists)
    setPlantType(savedPlantType)
    setPlantLevel(savedLevel)
  }, [])

  const createPlant = (type: "flower" | "tree") => {
    localStorage.setItem("hasPlant", "true")
    localStorage.setItem("selectedPlantType", type)
    localStorage.setItem("plantLevel", "1")
    localStorage.setItem("plantProgress", "0")

    setHasPlant(true)
    setPlantType(type)
    setPlantLevel(1)
  }

  const resetPlant = () => {
    localStorage.removeItem("hasPlant")
    localStorage.removeItem("selectedPlantType")
    localStorage.removeItem("plantLevel")
    localStorage.removeItem("plantProgress")

    setHasPlant(false)
    setPlantType(null)
    setPlantLevel(1)
  }

  return {
    hasPlant,
    plantType,
    plantLevel,
    createPlant,
    resetPlant,
  }
}
