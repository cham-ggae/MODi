"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useFamilySpace } from "@/contexts/family-space-context"
import { MessageCardDisplay } from "@/components/message-card-display"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface MessageCardDetailProps {
  cardId: string
  onClose: () => void
}

export function MessageCardDetail({ cardId, onClose }: MessageCardDetailProps) {
  const { isDarkMode } = useTheme()
  const { messageCards, addComment } = useFamilySpace()
  const [comment, setComment] = useState("")

  const card = messageCards.find((card) => card.id === cardId)
  if (!card) return null

  const handleAddComment = () => {
    if (!comment.trim()) return

    addComment(cardId, {
      sender: "나",
      avatar: "🧑",
      content: comment,
    })

    setComment("")
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg">
        <div className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <h2 className={`text-center text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
              메시지 카드
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>

          <div className="space-y-6 px-4 pb-6">
            {/* Card Display */}
            <div className="flex justify-center">
              <MessageCardDisplay
                design={card.design}
                message={card.message}
                sender={card.sender}
                timestamp={new Date(card.timestamp)}
                className="w-full max-w-md"
              />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-[#388E3C]"}`}>
                댓글 {card.comments?.length || 0}개
              </h3>

              {/* Comment List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {card.comments && card.comments.length > 0 ? (
                  card.comments.map((comment) => (
                    <div key={comment.id} className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#81C784] flex items-center justify-center text-white">
                          {comment.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{comment.sender}</div>
                          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {format(new Date(comment.timestamp), "PPP p", { locale: ko })}
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-[#4E342E]"}`}>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p>첫 번째 댓글을 남겨보세요!</p>
                  </div>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#81C784] flex items-center justify-center text-white">
                  🧑
                </div>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className={`flex-1 border-[#81C784] focus-visible:ring-[#81C784] ${
                      isDarkMode ? "bg-gray-700 text-white" : ""
                    }`}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button onClick={handleAddComment} size="icon" className="bg-[#81C784] hover:bg-[#388E3C]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
