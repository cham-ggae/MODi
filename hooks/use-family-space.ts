"use client"

import { useState, useEffect } from "react"

export function useFamilySpaceStatus() {
  const [hasFamilySpace, setHasFamilySpace] = useState<boolean | null>(null)

  useEffect(() => {
    // localStorage에서 가족 스페이스 생성 여부 확인
    const familySpaceStatus = localStorage.getItem("hasFamilySpace")
    const familyMembers = localStorage.getItem("familyMembers")

    // 가족 스페이스가 생성되었거나 가족 구성원이 있으면 true
    const hasFamily = familySpaceStatus === "true" || (familyMembers && JSON.parse(familyMembers).length > 0)
    setHasFamilySpace(hasFamily)
  }, [])

  const createFamilySpace = () => {
    localStorage.setItem("hasFamilySpace", "true")
    // 기본 가족 구성원 생성
    const defaultFamily = [
      { id: "1", name: "엄마", plan: "LTE 무제한 요금제", usage: "23GB", avatar: "🐛" },
      { id: "2", name: "아빠", plan: "5G 프리미엄 요금제", usage: "45GB", avatar: "👤" },
      { id: "3", name: "나", plan: "5G 슈퍼 요금제", usage: "67GB", avatar: "🐞" },
    ]
    localStorage.setItem("familyMembers", JSON.stringify(defaultFamily))
    setHasFamilySpace(true)
  }

  return {
    hasFamilySpace,
    createFamilySpace,
    isLoading: hasFamilySpace === null,
  }
}
