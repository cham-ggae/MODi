"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sprout, TreePine, Flower, Share2, Copy, Check, Edit2, Save, X, UserPlus } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePlantStatus } from "@/hooks/use-plant-status"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { MessageCardCreator } from "@/components/message-card-creator"
import { MessageCardList } from "@/components/message-card-list"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function FamilySpacePage() {
  const [inviteCode, setInviteCode] = useState("")
  const [familyName, setFamilyName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempFamilyName, setTempFamilyName] = useState("")
  const [copied, setCopied] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { hasPlant, plantType, createPlant } = usePlantStatus()
  const router = useRouter()
  const { toast } = useToast()

  const familyData = [
    {
      id: 1,
      name: "엄마",
      avatar: "🐛",
      plan: "LTE 무제한 요금제",
      hasRecommendation: false,
    },
    {
      id: 2,
      name: "아빠",
      avatar: "👤",
      plan: "5G 프리미엄 요금제",
      hasRecommendation: true,
    },
    {
      id: 3,
      name: "나",
      avatar: "🐞",
      plan: "5G 슈퍼 요금제",
      hasRecommendation: false,
    },
  ]

  useEffect(() => {
    const savedInviteCode = localStorage.getItem("familyInviteCode")
    const savedFamilyName = localStorage.getItem("familyName")
    if (savedInviteCode) setInviteCode(savedInviteCode)
    if (savedFamilyName) setFamilyName(savedFamilyName)
  }, [])

  const handlePlantAction = () => {
    if (hasPlant) {
      router.push("/plant-game")
    } else {
      router.push("/plant-selection")
    }
  }

  const handleCopyCode = async () => {
    if (!inviteCode) return

    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      toast({
        title: "초대 코드가 복사되었습니다!",
        description: "가족들에게 공유해보세요.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "복사에 실패했습니다",
        variant: "destructive",
      })
    }
  }

  const handleShareKakao = () => {
    if (!inviteCode || !familyName) return

    const shareText = `🌱 MODi 가족 스페이스에 초대합니다!\n\n가족 이름: ${familyName}\n초대 코드: ${inviteCode}\n\n함께 식물을 키우고 요금제도 절약해요! 💚\n\nMODi 앱 다운로드: https://modi.app`

    if (navigator.share) {
      navigator
        .share({
          title: "MODi 가족 스페이스 초대",
          text: shareText,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText)
          toast({
            title: "공유 링크가 복사되었습니다!",
            description: "카카오톡에서 붙여넣기 해주세요.",
          })
        })
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "공유 메시지가 복사되었습니다!",
        description: "카카오톡에서 붙여넣기 해주세요.",
      })
    }
  }

  const generateNewInviteCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const defaultFamilyName = "우리 가족"

    setInviteCode(newCode)
    setFamilyName(defaultFamilyName)

    localStorage.setItem("familyInviteCode", newCode)
    localStorage.setItem("familyName", defaultFamilyName)

    toast({
      title: "초대 코드가 생성되었습니다! 🎉",
      description: "이제 가족들을 초대할 수 있어요.",
    })
  }

  const handleEditFamilyName = () => {
    setTempFamilyName(familyName)
    setIsEditingName(true)
  }

  const handleSaveFamilyName = () => {
    if (tempFamilyName.trim()) {
      setFamilyName(tempFamilyName.trim())
      localStorage.setItem("familyName", tempFamilyName.trim())
      setIsEditingName(false)
      toast({
        title: "가족명이 변경되었습니다! ✨",
        description: `새로운 가족명: ${tempFamilyName.trim()}`,
      })
    }
  }

  const handleCancelEdit = () => {
    setTempFamilyName("")
    setIsEditingName(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/chat">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Link>
        <ThemeToggle />
      </div>

      {/* Plant Section */}
      <div className="text-center py-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="mb-6"
        >
          {hasPlant && plantType ? (
            <div className="w-24 h-24 mx-auto">
              <Image
                src={plantType === "flower" ? "/images/flower5.png" : "/images/tree5.png"}
                alt={plantType === "flower" ? "꽃" : "나무"}
                width={96}
                height={96}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          ) : (
            <div className="text-6xl">🌱</div>
          )}
        </motion.div>
        <Button
          onClick={handlePlantAction}
          className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full px-8 py-3 shadow-sm"
        >
          {hasPlant ? (
            <>
              <TreePine className="w-4 h-4 mr-2" />
              새싹 키우기
            </>
          ) : (
            <>
              <Sprout className="w-4 h-4 mr-2" />
              새싹 만들기
            </>
          )}
        </Button>

        {hasPlant && plantType && (
          <div className="text-center mt-3">
            <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">
              {plantType === "flower" ? (
                <>
                  <Flower className="w-3 h-3 mr-1" />꽃 키우는 중
                </>
              ) : (
                <>
                  <TreePine className="w-3 h-3 mr-1" />
                  나무 키우는 중
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="px-6 space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
        {/* Family Section with Invite */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">우리 가족</h2>
              <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-green-500 text-white hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-10 h-10 p-0"
                  >
                    <UserPlus className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">가족 초대하기</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {inviteCode ? (
                      <>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">초대 코드</div>
                          <Badge className="bg-green-500 text-white text-lg px-4 py-2 font-mono mb-3">
                            {inviteCode}
                          </Badge>

                          <div className="mb-4">
                            {isEditingName ? (
                              <div className="flex items-center gap-2 justify-center">
                                <Input
                                  value={tempFamilyName}
                                  onChange={(e) => setTempFamilyName(e.target.value)}
                                  className="text-center text-sm max-w-32 dark:bg-gray-600 dark:text-white"
                                  placeholder="가족명 입력"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleSaveFamilyName()
                                    }
                                  }}
                                />
                                <Button onClick={handleSaveFamilyName} size="sm" variant="ghost" className="p-1">
                                  <Save className="w-3 h-3 text-green-600 dark:text-green-400" />
                                </Button>
                                <Button onClick={handleCancelEdit} size="sm" variant="ghost" className="p-1">
                                  <X className="w-3 h-3 text-gray-400" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-center">
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  가족명: {familyName || "우리 가족"}
                                </span>
                                <Button onClick={handleEditFamilyName} size="sm" variant="ghost" className="p-1">
                                  <Edit2 className="w-3 h-3 text-gray-400" />
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleCopyCode}
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                              {copied ? "복사됨" : "복사"}
                            </Button>
                            <Button
                              onClick={handleShareKakao}
                              size="sm"
                              className="flex-1 bg-yellow-400 hover:bg-gray-400 text-black"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              카톡 공유
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-4xl mb-3">🔗</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">아직 초대 코드가 없어요</div>
                          <Button
                            onClick={generateNewInviteCode}
                            className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 text-white"
                          >
                            초대 코드 생성하기
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {familyData.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{member.plan}</div>
                    </div>
                  </div>
                  {member.hasRecommendation && (
                    <Button
                      size="sm"
                      className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      성향검사
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">추천 받은 결합 하러 가기</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💝</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">가족사랑 요금제</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">결합시 인원당 4천원 추가할인</div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-full"
              >
                이동
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Card Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">메시지 카드 공유</h2>
              <MessageCardCreator />
            </div>
            <MessageCardList />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
