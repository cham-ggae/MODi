"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useFamilySpace } from "@/contexts/family-space-context"

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
  nutrientActive: boolean
  nutrientCount: number
  completedCount: number
}

export interface DailyActivity {
  attendance: boolean
  water: boolean
  message: boolean
  quizOX: boolean
  quizLastLeaf: boolean
  allWatered: boolean
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
  addExp: (points: number) => void
  useNutrient: () => void
  markActivityComplete: (activity: keyof DailyActivity) => void
  waterPlant: (memberId: string, memberName: string, avatar: string) => void
  claimReward: () => void
  resetPlant: () => void
  getProgressPercentage: () => number
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
    message: false,
    quizOX: false,
    quizLastLeaf: false,
    allWatered: false,
  })
  const [familyWatering, setFamilyWatering] = useState<FamilyWatering[]>([])
  const [rewards, setRewards] = useState<PlantReward[]>(DEFAULT_REWARDS)

  // 가족 수에 따른 레벨별 경험치 요구량 계산
  const calculateRequiredExp = (level: number): number => {
    const familyCount = familyMembers.length || 2
    const basePoints = {
      2: [150, 200, 250, 300],
      3: [200, 250, 300, 350],
      4: [250, 300, 350, 400],
      5: [300, 350, 400, 450],
    }

    // 가족 수가 2~5명 범위를 벗어나면 기본값 사용
    const familySize = familyCount >= 2 && familyCount <= 5 ? familyCount : 2

    // 레벨은 1부터 시작하므로 배열 인덱스는 level-1
    // 레벨 5는 최종 레벨이므로 더 이상 경험치가 필요 없음
    return level >= 1 && level <= 4 ? basePoints[familySize as keyof typeof basePoints][level - 1] : 999999
  }

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
        localStorage.setItem(
          "dailyActivities",
          JSON.stringify({
            attendance: false,
            water: false,
            message: false,
            quizOX: false,
            quizLastLeaf: false,
            allWatered: false,
          }),
        )
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
      requiredExp: calculateRequiredExp(1),
      isCompleted: false,
      createdAt: new Date(),
      nutrientActive: false,
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
  const addExp = (points: number) => {
    if (!plantState || plantState.isCompleted) return

    // 영양제 효과가 있으면 물주기 포인트 2배
    const actualPoints = plantState.nutrientActive && points === 5 ? points * 2 : points

    let newExp = plantState.currentExp + actualPoints
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

      newRequiredExp = calculateRequiredExp(newLevel)
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

  // 영양제 사용
  const useNutrient = () => {
    if (!plantState || plantState.nutrientCount <= 0) return

    const updatedPlant = {
      ...plantState,
      nutrientActive: true,
      nutrientCount: plantState.nutrientCount - 1,
    }

    setPlantState(updatedPlant)
    localStorage.setItem("plantState", JSON.stringify(updatedPlant))

    // 영양제 효과는 하루 동안 지속 (실제로는 localStorage에 저장된 상태로 유지)
    setTimeout(
      () => {
        if (plantState) {
          const resetPlant = {
            ...plantState,
            nutrientActive: false,
          }
          setPlantState(resetPlant)
          localStorage.setItem("plantState", JSON.stringify(resetPlant))
        }
      },
      24 * 60 * 60 * 1000,
    ) // 24시간
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

    // 활동에 따른 포인트 지급
    const pointsMap: Record<keyof DailyActivity, number> = {
      attendance: 5,
      water: 5,
      message: 10,
      quizOX: 10,
      quizLastLeaf: 10,
      allWatered: 0, // 별도 처리
    }

    addExp(pointsMap[activity])
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

    // 물주기 활동 완료 표시 및 포인트 지급
    if (!dailyActivities.water) {
      markActivityComplete("water")
    }

    // 모든 가족 구성원이 물을 줬는지 확인
    const allWatered = updatedWatering.every((member) => member.hasWatered)
    if (allWatered && !dailyActivities.allWatered) {
      // 모두 물을 줬으면 영양제 +1 및 활동 완료 표시
      const updatedPlant = {
        ...plantState,
        nutrientCount: plantState.nutrientCount + 1,
      }

      setPlantState(updatedPlant)
      localStorage.setItem("plantState", JSON.stringify(updatedPlant))

      // allWatered 활동 완료 표시
      const updatedActivities = {
        ...dailyActivities,
        allWatered: true,
      }

      setDailyActivities(updatedActivities)
      localStorage.setItem("dailyActivities", JSON.stringify(updatedActivities))
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
    if (plantState.isCompleted) return 100

    return Math.min(100, Math.floor((plantState.currentExp / plantState.requiredExp) * 100))
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
