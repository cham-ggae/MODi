"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RefreshCw, Share2, MessageCircle, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"

interface UserType {
  type: string
  emoji: string
  title: string
  description: string
  personality: string
  recommendations: string[]
  savings: number
  message: string
}

const userTypes: Record<string, UserType> = {
  호박벌형: {
    type: "호박벌형",
    emoji: "🐝",
    title: "데이터 쏘는 꿀벌",
    description: "유튜브, 넷플릭스 등 OTT를 즐겨보며 하루 종일 데이터 풀가동!",
    personality: "부지런하고 활동적. 틈만 나면 영상 콘텐츠를 탐색하는 정보 소비꾼!",
    recommendations: ["5G 프리미어 에센셜", "5G 프리미어 레귤러"],
    savings: 25000,
    message: "꿀벌형인 당신, 멈추지 마세요! 꿀처럼 달콤한 무제한 요금제를 추천해요🍯",
  },
  장수풍뎅이형: {
    type: "장수풍뎅이형",
    emoji: "🪲",
    title: "내 가족은 내가 지킨다",
    description: "가족과 함께 요금제를 묶고 할인까지 챙기는 전략형 사용자",
    personality: "든든하고 실속파. 가족을 생각하는 따뜻한 계획형 소비자",
    recommendations: ["U+투게더 결합", "참 쉬운 가족 결합"],
    savings: 45000,
    message: "장수풍뎅이형이라면 가족이 먼저! 함께 쓰면 더 커지는 할인 혜택을 받아보세요🪲",
  },
  무당벌레형: {
    type: "무당벌레형",
    emoji: "🐞",
    title: "TMI 유발 대화형",
    description: "통화량 많고, 하루 1~2시간은 기본. 문자보다 전화가 편한 타입",
    personality: "수다쟁이, 사람들과의 대화가 에너지 원천인 커뮤니케이터",
    recommendations: ["LTE 선택형 요금제", "5G 심플+", "유쓰 5G 스탠다드"],
    savings: 20000,
    message: "무당벌레형은 통화가 생명! 무제한으로 수다 떨어도 부담 없는 요금제를 추천해요📞",
  },
  개미형: {
    type: "개미형",
    emoji: "🐜",
    title: "티끌 모아 태산이겠지",
    description: "데이터는 아껴 쓰고, 통화도 적은 알뜰한 소비자",
    personality: "검소하고 실속형. 요금제는 작아도 충분히 만족!",
    recommendations: ["유쓰 5G 미니", "유쓰 5G 슬림+"],
    savings: 15000,
    message: "개미형이라면 한 방울도 아깝지요! 알뜰한 당신에게 꼭 맞는 요금제가 있어요🍃",
  },
  나비형: {
    type: "나비형",
    emoji: "🦋",
    title: "알잘딱깔센 혜택중심형",
    description: "약정 할인, 멤버십, 기기 혜택 등 총체적 혜택을 고려하는 합리주의자",
    personality: "감각적이고 계획적인 소비자. 혜택을 꼼꼼히 따져서 결정함",
    recommendations: ["5G 프리미어 플러스", "U+ 멤버십 결합 상품"],
    savings: 35000,
    message: "나비형은 아름답게 혜택을 날개처럼 펼치죠🦋 지금 당신에게 가장 유리한 조건으로 안내할게요!",
  },
}

export default function ResultPage() {
  const { isDarkMode } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isSkipped, setIsSkipped] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const skipped = searchParams.get("skipped") === "true"
    setIsSkipped(skipped)

    if (skipped) {
      // Age-based recommendation
      const basicInfo = localStorage.getItem("userBasicInfo")
      if (basicInfo) {
        const { ageGroup } = JSON.parse(basicInfo)
        const ageBasedType = getAgeBasedType(ageGroup)
        setUserType(userTypes[ageBasedType])
      } else {
        setUserType(userTypes["개미형"]) // Default
      }
    } else {
      // Survey-based recommendation
      const answers = localStorage.getItem("surveyAnswers")
      if (answers) {
        const surveyAnswers = JSON.parse(answers)
        const recommendedType = calculateUserType(surveyAnswers)
        setUserType(userTypes[recommendedType])
      } else {
        setUserType(userTypes["개미형"]) // Default
      }
    }

    // Save recommendation history
    if (userType) {
      const history = JSON.parse(localStorage.getItem("recommendationHistory") || "[]")
      const newRecord = {
        id: Date.now().toString(),
        type: userType.type,
        date: new Date().toISOString(),
        isSkipped: skipped,
        planRecommendations: userType.recommendations,
        savings: userType.savings,
      }
      history.unshift(newRecord)
      localStorage.setItem("recommendationHistory", JSON.stringify(history.slice(0, 10))) // Keep last 10
    }

    // Animation timer
    setTimeout(() => setShowAnimation(false), 3000)
  }, [searchParams, userType])

  const getAgeBasedType = (ageGroup: string) => {
    const ageTypeMap: Record<string, string> = {
      "10대": "개미형",
      "20-30대": "호박벌형",
      "40-50대": "장수풍뎅이형",
      "60대 이상": "무당벌레형",
    }
    return ageTypeMap[ageGroup] || "개미형"
  }

  const calculateUserType = (answers: Record<number, string>) => {
    // Simple scoring algorithm based on survey answers
    const scores = {
      호박벌형: 0,
      장수풍뎅이형: 0,
      무당벌레형: 0,
      개미형: 0,
      나비형: 0,
    }

    // Question 1: Plan type
    if (answers[1] === "family") scores.장수풍뎅이형 += 3
    if (answers[1] === "online") scores.개미형 += 2
    if (answers[1] === "individual") scores.호박벌형 += 2

    // Question 2: Data usage
    if (answers[2] === "over50") scores.호박벌형 += 3
    if (answers[2] === "10to50") scores.나비형 += 2
    if (answers[2] === "under5") scores.개미형 += 3

    // Question 8: Call usage
    if (answers[8] === "over120") scores.무당벌레형 += 3
    if (answers[8] === "60to120") scores.무당벌레형 += 2

    // Question 7: Benefits preference
    if (answers[7] === "subscription") scores.나비형 += 2
    if (answers[7] === "discount") scores.장수풍뎅이형 += 2

    // Find the type with highest score
    return Object.entries(scores).reduce((a, b) => (scores[a[0]] > scores[b[0]] ? a : b))[0]
  }

  const handleShareResult = () => {
    if (!userType) return

    const shareText = `MODi 요금제 추천 결과\n\n🎯 나의 유형: ${userType.type}\n📱 추천 요금제: ${userType.recommendations.join(", ")}\n💰 예상 절약 금액: 월 ${userType.savings.toLocaleString()}원\n\n나에게 딱 맞는 요금제를 찾아보세요!`

    if (navigator.share) {
      navigator.share({
        title: "MODi 요금제 추천 결과",
        text: shareText,
      })
    } else {
      // 카카오톡 공유 (실제 구현 시 카카오 SDK 필요)
      alert("카카오톡으로 공유하기 기능이 곧 추가됩니다!")
    }
  }

  if (!userType) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#388E3C] mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-white" : "text-gray-600"}>결과를 분석하고 있습니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <header className={`${isDarkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-sm"}`}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className={isDarkMode ? "text-gray-300" : ""}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-green-800"}`}>추천 결과</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Result Animation */}
        {showAnimation && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {userType.emoji}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-green-800"}`}>
                당신은 {userType.type}!
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{userType.title}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Result Card */}
        <Card
          className={`${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          } mb-6`}
        >
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">{userType.emoji}</div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-green-800"}`}>
              {userType.type}
            </h2>
            <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-green-700"}`}>{userType.title}</p>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{userType.description}</p>

            <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-4 rounded-lg mb-4`}>
              <p className={`font-medium text-center ${isDarkMode ? "text-gray-300" : "text-green-800"}`}>
                {userType.message}
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handleShareResult} className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                카톡 공유
              </Button>
              <Button
                onClick={handleShareResult}
                variant="outline"
                className={`border-green-600 text-green-600 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-50"}`}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? "text-white" : "text-green-800"}`}>성격 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{userType.personality}</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? "text-white" : "text-green-800"}`}>추천 요금제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userType.recommendations.map((plan, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-green-50"
                  } border ${isDarkMode ? "border-gray-600" : "border-green-200"}`}
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-green-800"}`}>{plan}</span>
                  {index === 0 && (
                    <Badge className="ml-auto bg-green-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      추천
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings */}
        <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-6`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isDarkMode ? "text-white" : "text-green-800"}`}>예상 절약 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">월 {userType.savings.toLocaleString()}원</div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                기존 요금제 대비 절약 가능 금액
              </p>
              <div className="mt-4">
                <Progress value={75} className="h-2" />
                <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  연간 최대 {(userType.savings * 12).toLocaleString()}원 절약
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Method Info */}
        {isSkipped && (
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"} mb-6`}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="text-blue-500 mr-3">ℹ️</div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-blue-800"}`}>
                    나이대 기반 추천
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-blue-600"}`}>
                    더 정확한 추천을 위해 설문조사를 진행해보세요!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/chat">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">AI 상담 받기</Button>
          </Link>

          <Link href="/survey">
            <Button
              variant="outline"
              className={`w-full border-green-600 text-green-600 ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-50"
              }`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 검사하기
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={`w-full ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
