"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { MessageCardDisplay } from "@/components/message-card-display"
import { MessageCardModal } from "@/components/message-card-modal"
import { MessageCardDetail } from "@/components/message-card-detail"

interface MessageCard {
  id: string
  sender: string
  message: string
  design: string
  timestamp: Date
  comments: any[]
}

interface MessageCardSectionProps {
  messageCards: MessageCard[]
  onSendCard: (design: string, message: string) => void
}

export function MessageCardSection({ messageCards, onSendCard }: MessageCardSectionProps) {
  const { isDarkMode } = useTheme()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId)
  }

  const handleCloseDetail = () => {
    setSelectedCardId(null)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <Card className={`border border-[#81C784] ${isDarkMode ? "bg-gray-800" : "bg-white"} mb-6`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-[#388E3C]">
              <MessageSquare className="w-5 h-5 mr-2" />
              최근 메시지 카드
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MessageCardModal onSendCard={onSendCard}>
                <Button className="bg-[#81C784] hover:bg-[#388E3C] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  메시지 카드 보내기
                </Button>
              </MessageCardModal>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          {messageCards.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {messageCards.slice(0, 6).map((card) => (
                <motion.div key={card.id} variants={item}>
                  <MessageCardDisplay
                    design={card.design}
                    message={card.message}
                    sender={card.sender}
                    timestamp={new Date(card.timestamp)}
                    className="h-32 transform transition-transform hover:scale-105"
                    onClick={() => handleCardClick(card.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className={`text-center py-12 ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"} opacity-70`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">아직 메시지 카드가 없습니다</p>
              <p className="text-sm">첫 번째 메시지 카드를 보내보세요!</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Message Card Detail Modal */}
      {selectedCardId && <MessageCardDetail cardId={selectedCardId} onClose={handleCloseDetail} />}
    </>
  )
}
