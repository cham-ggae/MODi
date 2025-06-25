"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  Star,
  Gift,
  Coffee,
  Sun,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessageCardsManager, useMessageCardCommentsManager } from "@/hooks/family";
import { MessageCard } from "@/types/message-card.type";
import { MessageCardComment } from "@/types/message-card.type";
import Image from "next/image";
import { useMessageCardCommentCount } from "@/hooks/family/useFamilyQueries";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const cardTemplates = [
  { id: "heart", icon: Heart, color: "bg-pink-100 text-pink-600", name: "사랑" },
  { id: "star", icon: Star, color: "bg-yellow-100 text-yellow-600", name: "응원" },
  { id: "gift", icon: Gift, color: "bg-purple-100 text-purple-600", name: "선물" },
  { id: "coffee", icon: Coffee, color: "bg-brown-100 text-brown-600", name: "일상" },
  { id: "sun", icon: Sun, color: "bg-orange-100 text-orange-600", name: "기분" },
];

// 개별 카드의 댓글 개수 표시 컴포넌트
function CommentCount({ fcid }: { fcid: number }) {
  const { data } = useMessageCardCommentCount(fcid);
  return <span>{data?.commentCount || 0}</span>;
}

export function MessageCardList() {
  const [selectedCard, setSelectedCard] = useState<MessageCard | null>(null);
  const [editingCard, setEditingCard] = useState<{ content: string } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const { messageCards, totalCount, isLoading, isDeleting, deleteMessageCard, updateMessageCard, refetch } =
    useMessageCardsManager();

  // 선택된 카드의 댓글 관리
  const commentsManager = useMessageCardCommentsManager(selectedCard?.fcid);

  const displayedCards = showAll ? messageCards : messageCards.slice(0, 1);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedCard) return;

    try {
      await commentsManager.createComment({ content: newComment.trim() });
      setNewComment("");
      toast({
        title: "댓글이 작성되었습니다! 💬",
        description: "가족과의 소통이 더욱 활발해졌어요.",
      });
    } catch (error) {
      toast({
        title: "댓글 작성 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !selectedCard) return;

    try {
      await commentsManager.updateComment(editingComment.id, {
        content: editingComment.content.trim(),
      });
      setEditingComment(null);
      toast({
        title: "댓글이 수정되었습니다! ✏️",
      });
    } catch (error) {
      toast({
        title: "댓글 수정 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!selectedCard) return;

    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await commentsManager.deleteComment(commentId);
        toast({
          title: "댓글이 삭제되었습니다! 🗑️",
        });
      } catch (error) {
        toast({
          title: "댓글 삭제 실패",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCard = (fcid: number) => {
    if (confirm("정말로 이 메시지 카드를 삭제하시겠습니까?")) {
      deleteMessageCard(fcid);
    }
  };

  const handleCardSelect = (card: MessageCard) => {
    setSelectedCard(card);
    setNewComment("");
    setEditingComment(null);
  };

  const handleUpdateCard = async () => {
    if (!editingCard || !selectedCard) return;

    try {
      await updateMessageCard({
        fcid: selectedCard.fcid,
        data: { 
          content: editingCard.content.trim(),
          imageType: selectedCard.imageType
        }
      });
      setEditingCard(null);
      // 카드 목록 새로고침
      refetch();
      toast({
        title: "메시지 카드가 수정되었습니다! ✏️",
      });
    } catch (error) {
      toast({
        title: "메시지 카드 수정 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCard(null);
        setEditingCard(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">메시지 카드를 불러오는 중...</p>
      </div>
    );
  }

  if (messageCards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">💌</div>
        <p className="text-gray-500 dark:text-gray-400">아직 메시지 카드가 없어요</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          + 버튼을 눌러 첫 번째 카드를 만들어보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {displayedCards.map((card) => {
            const template = cardTemplates.find((t) => t.id === card.imageType);
            const Icon = template?.icon || Heart;

            return (
              <motion.div
                key={card.fcid}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{}}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-700"
                  onClick={() => handleCardSelect(card)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        className={`w-5 h-5 ${template?.color.split(" ")[1] || "text-pink-600"}`}
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                        {cardTemplates.find((t) => t.id === card.imageType)?.name || card.imageType}
                      </h3>
                      <div className="flex items-center gap-2">
                        {card.authorProfileImage ? (
                          <Image
                            src={card.authorProfileImage}
                            alt={`${card.authorName}의 프로필`}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            {card.authorName.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs text-gray-400">{card.authorName}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{card.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(card.createdAt).toLocaleDateString("ko-KR")}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <CommentCount fcid={card.fcid} />
                        </div>
                        {card.canDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 h-auto text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.fcid);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {messageCards.length > 1 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gray-500 hover:bg-transparent hover:text-green-600 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-green-400"
          >
            <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4 mr-1" />
            </motion.div>
            {showAll ? "숨기기" : `최근 메시지 ${messageCards.length - 1}개 더보기`}
          </Button>
        </div>
      )}

      {/* 카드 상세 모달 */}
      <AnimatePresence>
        {selectedCard && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedCard(null);
                setEditingCard(null);
              }}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
            />
            
            {/* Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl p-6 pt-4 max-w-md mx-auto"
              style={{ borderRadius: "20px" }}
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  메시지 카드
                </h2>
              </div>

              <div className="space-y-4">
                {/* 작성자 정보 */}
                <div className="flex items-center gap-3">
                  {selectedCard.authorProfileImage ? (
                    <Image
                      src={selectedCard.authorProfileImage}
                      alt={`${selectedCard.authorName}의 프로필`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {selectedCard.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedCard.authorName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(selectedCard.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>

                {/* 카드 내용 */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  {editingCard ? (
                    <div className="space-y-3">
                      <Input
                        value={editingCard.content}
                        onChange={(e) => setEditingCard({ content: e.target.value })}
                        placeholder="메시지를 입력하세요..."
                        className="w-full"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setEditingCard(null)}
                          className="text-sm"
                        >
                          취소
                        </Button>
                        <Button
                          onClick={handleUpdateCard}
                          disabled={!editingCard.content.trim()}
                          className="bg-[#5bc236] hover:bg-[#4ca52d] text-white text-sm"
                        >
                          수정
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-gray-700 dark:text-gray-300 flex-1">{selectedCard.content}</p>
                      {selectedCard.canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => setEditingCard({ content: selectedCard.content })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">댓글</h3>
                    <span className="text-sm text-gray-500">
                      {commentsManager.comments.length}개의 댓글
                    </span>
                  </div>

                  {/* 댓글 입력 */}
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commentsManager.isCreating}
                      className="bg-[#5bc236] hover:bg-green-600 text-white"
                    >
                      {commentsManager.isCreating ? "..." : "작성"}
                    </Button>
                  </div>

                  {/* 댓글 목록 */}
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                    {commentsManager.comments.map((comment) => (
                      <div
                        key={comment.commentId}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                          {comment.authorName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {comment.authorName}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                              </span>
                              {comment.canDelete && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-gray-500 hover:text-gray-700"
                                    onClick={() => setEditingComment({ id: comment.commentId, content: comment.content })}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-1 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          {editingComment?.id === comment.commentId ? (
                            <div className="mt-2">
                              <div className="relative">
                                <Input
                                  value={editingComment.content}
                                  onChange={(e) =>
                                    setEditingComment((prev) => (prev ? { ...prev, content: e.target.value } : null))
                                  }
                                  placeholder="댓글을 입력하세요..."
                                  className="pr-[140px]"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleUpdateComment();
                                    }
                                  }}
                                />
                                <div className="absolute right-1 top-1 flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingComment(null)}
                                    className="h-7 text-xs px-2"
                                  >
                                    취소
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleUpdateComment}
                                    disabled={!editingComment.content.trim()}
                                    className="h-7 text-xs px-2 bg-[#5bc236] hover:bg-[#4ca52d] text-white"
                                  >
                                    수정
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 break-words">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
