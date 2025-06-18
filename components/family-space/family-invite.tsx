"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Share2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { useToast } from "@/hooks/use-toast"

export function FamilyInvite() {
  const { isDarkMode } = useTheme()
  const { toast } = useToast()
  const [inviteCode] = useState("MODI2024")
  const [isCopied, setIsCopied] = useState(false)

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setIsCopied(true)

    toast({
      title: "초대 코드가 복사되었습니다!",
      description: "가족에게 공유해보세요.",
      duration: 3000,
    })

    setTimeout(() => setIsCopied(false), 2000)
  }

  const shareInviteCode = () => {
    if (navigator.share) {
      navigator.share({
        title: "MODi 가족 스페이스 초대",
        text: `MODi 가족 스페이스에 참여하세요! 초대 코드: ${inviteCode}`,
        url: window.location.href,
      })
    } else {
      copyInviteCode()
    }
  }

  return (
    <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"} h-full`}>
      <CardHeader>
        <CardTitle className="text-[#388E3C]">가족 초대하기</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className={`${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} mb-4`}>
            가족 구성원으로부터 초대 코드를 받으셨나요?
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              value={inviteCode}
              readOnly
              className={`flex-1 border-[#81C784] focus-visible:ring-[#81C784] ${
                isDarkMode ? "bg-gray-700 text-white" : ""
              }`}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={copyInviteCode}
                className={`${isCopied ? "bg-green-600" : "bg-[#81C784]"} hover:bg-[#388E3C] text-white`}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70 mb-4`}>
            초대 코드를 가족에게 공유하세요
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={shareInviteCode}
              className={`w-full border-[#81C784] text-[#388E3C] ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-[#F1F8E9]"
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              초대 코드 공유하기
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
