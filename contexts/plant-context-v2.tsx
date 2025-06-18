"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useFamilySpace } from "@/contexts/family-space-context"
import { PointService } from "@/services/point-service"

export type PlantType = "flower" | "tree"

export interface PlantReward {
  id: string
  name: string
  description: string
  icon: string
  claimed: boolean
  claimedBy?: string
  claimedAt?: Date
}

export interface PlantState {
  id: string
  type: PlantType
  level: number
  currentExp: number
  requiredExp: number
  isCompleted: boolean
  createdAt: Date
  completedAt?: Date
  nutrientCount: number
  completedCount: number
}

export interface DailyActivity {
  attendance: boolean
  water: boolean
  nutrient: boolean
  emotion: boolean
  quiz: boolean
  lastleaf: boolean
  register: boolean
  survey: boolean
}

export interface FamilyWatering {
  memberId: string
  memberName: string
  avatar: string
  hasWatered: boolean
  wateredAt?: Date
}

interface PlantContextType {
  plantState: PlantState | null
  dailyActivities: DailyActivity
  familyWatering: FamilyWatering[]
  rewards: PlantReward[]
  selectPlant: (type: PlantType) => void
  addExp: (activityType: keyof DailyActivity) => void
  useNutrient: () => void
  markActivityComplete: (activity: keyof DailyActivity) => void
  waterPlant: (memberId: string, memberName: string, avatar: string) => void
  claimReward: () => void
  resetPlant: () => void
  getProgressPercentage: () => number
  getRemainingExp: () => number
}

const PlantContext = createContext<PlantContextType | undefined>(undefined)

const DEFAULT_REWARDS: PlantReward[] = [
  {
    id: "1",
    name: "OTT 한달 무료 이용권",
    description: "넷플릭스, 왓챠, 티빙 중 선택 가능한 1개월 무료 이용권",
    icon: "🎬",
    claimed: false,
  },
  {
    id: "2",
    name: "가족 결합 할인권",
    description: "다음 달 가족 결합 요금제 10% 추가 할인",
    icon: "💰",
    claimed: false,
  },
  {
    id: "3",
    name: "베라 패밀리 사이즈",
    description: "배스킨라빈스 패밀리 사이즈 아이스크림 교환권",
    icon: "🍦",
    claimed: false,
  },
  {
    id: "4",
    name: "로밍 할인 쿠폰",
    description: "해외 로밍 50% 할인 쿠폰",
    icon: "✈️",
    claimed: false,
  },
]

export function PlantProvider({ children }: { children: ReactNode }) {
  const { familyMembers } = useFamilySpace()
  const [plantState, setPlantState] = useState<PlantState | null>(null)
  const [dailyActivities, setDailyActivities] = useState<DailyActivity>({
    attendance: false,
    water: false,
    nutrient: false,
    emotion: false,
    quiz: false,
    lastleaf: false,
    register: false,
    survey: false,
  })
  const [familyWatering, setFamilyWatering] = useState<FamilyWatering[]>([])
  const [rewards, setRewards] = useState<PlantReward[]>(DEFAULT_REWARDS)

  useEffect(() => {
    // localStorage에서 식물 상태 불러오기
    const savedPlantState = localStorage.getItem("plantState")
    const savedDailyActivities = localStorage.getItem("dailyActivities")
    const savedFamilyWatering = localStorage.getItem("familyWatering")
    const savedRewards = localStorage.getItem("plantRewards")

    if (savedPlantState) {
      const parsedState = JSON.parse(savedPlantState)
      setPlantState(parsedState)
    }

    if (savedDailyActivities) {
      // 날짜 확인하여 오늘이 아니면 초기화
      const today = new Date().toDateString()
      const savedDate = localStorage.getItem("dailyActivitiesDate")

      if (savedDate === today) {
        setDailyActivities(JSON.parse(savedDailyActivities))
      } else {
        // 새로운 날짜면 활동 초기화
        localStorage.setItem("dailyActivitiesDate", today)
        const initialActivities = {
          attendance: false,
          water: false,
          nutrient: false,
          emotion: false,
          quiz: false,
          lastleaf: false,
          register: false,
          survey: false,
        }
        localStorage.setItem("dailyActivities", JSON.stringify(initialActivities))
        setDailyActivities(initialActivities)
      }
    } else {
      // 처음 접속 시 오늘 날짜 저장
      localStorage.setItem("dailyActivitiesDate", new Date().toDateString())
    }

    if (savedFamilyWatering) {
      setFamilyWatering(JSON.parse(savedFamilyWatering))
    } else if (familyMembers.length > 0) {
      // 가족 구성원 정보로 초기 물주기 상태 설정
      const initialWatering = familyMembers.map((member) => ({
        memberId: member.id,
        memberName: member.name,
        avatar: member.avatar,
        hasWatered: false,
      }))
      setFamilyWatering(initialWatering)
      localStorage.setItem("familyWatering", JSON.stringify(initialWatering))
    }

    if (savedRewards) {
      setRewards(JSON.parse(savedRewards))
    }
  }, [familyMembers])

  // 식물 선택 및 초기화
  const selectPlant = (type: PlantType) => {
    const newPlant: PlantState = {
      id: Date.now().toString(),
      type,
      level: 1,
      currentExp: 0,
      requiredExp: PointService.getExpThreshold(familyMembers.length, 1),
      isCompleted: false,
      createdAt: new Date(),
      nutrientCount: 1, // 시작 시 영양제 1개 지급
      completedCount: plantState?.completedCount || 0,
    }

    setPlantState(newPlant)
    localStorage.setItem("plantState", JSON.stringify(newPlant))

    // 물주기 상태 초기화
    if (familyMembers.length > 0) {
      const initialWatering = familyMembers.map((member) => ({
        memberId: member.id,
        memberName: member.name,
        avatar: member.avatar,
        hasWatered: false,
      }))
      setFamilyWatering(initialWatering)
      localStorage.setItem("familyWatering", JSON.stringify(initialWatering))
    }

    // 보상 초기화
    setRewards(DEFAULT_REWARDS)
    localStorage.setItem("plantRewards", JSON.stringify(DEFAULT_REWARDS))
  }

  // 경험치 추가 및 레벨업 처리
  const addExp = (activityType: keyof DailyActivity) => {
    if (!plantState || plantState.isCompleted) return

    const points = PointService.getActivityPoints(activityType)
    let newExp = plantState.currentExp + points
    let newLevel = plantState.level
    let newRequiredExp = plantState.requiredExp
    let isCompleted = plantState.isCompleted

    // 레벨업 체크
    while (newExp >= newRequiredExp && newLevel < 5) {
      newExp -= newRequiredExp
      newLevel++

      // 레벨 5에 도달하면 완료 상태로 변경
      if (newLevel === 5) {
        isCompleted = true
        break
      }

      newRequiredExp = PointService.getExpThreshold(familyMembers.length, newLevel)
    }

    // 레벨 5에서는 경험치를 더 이상 누적하지 않음
    if (newLevel === 5) {
      newExp = 0
    }

    const updatedPlant = {
      ...plantState,
      level: newLevel,
      currentExp: newExp,
      requiredExp: newRequiredExp,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
    }

    setPlantState(updatedPlant)
    localStorage.setItem("plantState", JSON.stringify(updatedPlant))
  }

  // 영양제 사용 (단순히 10점 추가)
  const useNutrient = () => {
    if (!plantState || plantState.nutrientCount <= 0) return

    const updatedPlant = {
      ...plantState,
      nutrientCount: plantState.nutrientCount - 1,
    }

    setPlantState(updatedPlant)
    localStorage.setItem("plantState", JSON.stringify(updatedPlant))

    // 영양제 사용으로 10점 추가
    addExp("nutrient")
  }

  // 일일 활동 완료 표시
  const markActivityComplete = (activity: keyof DailyActivity) => {
    if (dailyActivities[activity]) return // 이미 완료한 활동이면 무시

    const updatedActivities = {
      ...dailyActivities,
      [activity]: true,
    }

    setDailyActivities(updatedActivities)
    localStorage.setItem("dailyActivities", JSON.stringify(updatedActivities))

    // 활동 완료로 경험치 추가
    addExp(activity)
  }

  // 물주기
  const waterPlant = (memberId: string, memberName: string, avatar: string) => {
    if (!plantState) return

    // 이미 물을 준 가족 구성원인지 확인
    const alreadyWatered = familyWatering.find((member) => member.memberId === memberId)?.hasWatered
    if (alreadyWatered) return

    // 물주기 상태 업데이트
    const updatedWatering = familyWatering.map((member) =>
      member.memberId === memberId ? { ...member, hasWatered: true, wateredAt: new Date() } : member,
    )

    setFamilyWatering(updatedWatering)
    localStorage.setItem("familyWatering", JSON.stringify(updatedWatering))

    // 현재 사용자가 물을 준 경우에만 활동 완료 표시
    if (memberId === "3" && !dailyActivities.water) {
      markActivityComplete("water")
    }

    // 모든 가족 구성원이 물을 줬는지 확인
    const allWatered = updatedWatering.every((member) => member.hasWatered)
    if (allWatered) {
      // 모두 물을 줬으면 영양제 +1
      const updatedPlant = {
        ...plantState,
        nutrientCount: plantState.nutrientCount + 1,
      }

      setPlantState(updatedPlant)
      localStorage.setItem("plantState", JSON.stringify(updatedPlant))
    }
  }

  // 보상 수령
  const claimReward = () => {
    if (!plantState || !plantState.isCompleted) return

    // 보상 수령 처리
    const updatedRewards = rewards.map((reward) =>
      !reward.claimed
        ? {
            ...reward,
            claimed: true,
            claimedBy: "나", // 실제로는 현재 사용자 정보 사용
            claimedAt: new Date(),
          }
        : reward,
    )

    setRewards(updatedRewards)
    localStorage.setItem("plantRewards", JSON.stringify(updatedRewards))

    // 완료된 식물 카운트 증가
    const updatedPlant = {
      ...plantState,
      completedCount: plantState.completedCount + 1,
    }

    setPlantState(updatedPlant)
    localStorage.setItem("plantState", JSON.stringify(updatedPlant))
  }

  // 식물 초기화 (새로운 식물 선택 화면으로 전환)
  const resetPlant = () => {
    setPlantState(null)
    localStorage.removeItem("plantState")
  }

  // 현재 레벨의 진행률 계산 (%)
  const getProgressPercentage = () => {
    if (!plantState) return 0
    return PointService.getProgressPercentage(plantState.currentExp, familyMembers.length, plantState.level)
  }

  // 다음 레벨까지 남은 경험치
  const getRemainingExp = () => {
    if (!plantState) return 0
    return PointService.getRemainingExp(plantState.currentExp, familyMembers.length, plantState.level)
  }

  return (
    <PlantContext.Provider
      value={{
        plantState,
        dailyActivities,
        familyWatering,
        rewards,
        selectPlant,
        addExp,
        useNutrient,
        markActivityComplete,
        waterPlant,
        claimReward,
        resetPlant,
        getProgressPercentage,
        getRemainingExp,
      }}
    >
      {children}
    </PlantContext.Provider>
  )
}

export function usePlant() {
  const context = useContext(PlantContext)
  if (context === undefined) {
    throw new Error("usePlant must be used within a PlantProvider")
  }
  return context
}
