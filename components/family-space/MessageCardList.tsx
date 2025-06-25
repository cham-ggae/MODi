"use client";

import { useState } from "react";
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
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(
    null
  );
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const { messageCards, totalCount, isLoading, isDeleting, deleteMessageCard, refetch } =
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
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">메시지 카드</DialogTitle>
              </DialogHeader>

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
                  <p className="text-gray-700 dark:text-gray-300">{selectedCard.content}</p>
                </div>

                {/* 댓글 목록 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    댓글 ({commentsManager.totalCount})
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {commentsManager.isLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mx-auto"></div>
                      </div>
                    ) : commentsManager.comments.length > 0 ? (
                      commentsManager.comments.map((comment) => (
                        <div
                          key={comment.commentId}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 mb-2">
                              {comment.authorProfileImage ? (
                                <Image
                                  src={comment.authorProfileImage}
                                  alt={`${comment.authorName}의 프로필`}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                  {comment.authorName.charAt(0)}
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {comment.authorName}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {comment.canModify && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-1 h-auto"
                                  onClick={() =>
                                    setEditingComment({
                                      id: comment.commentId,
                                      content: comment.content,
                                    })
                                  }
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              )}
                              {comment.canDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-1 h-auto text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteComment(comment.commentId)}
                                  disabled={commentsManager.isDeleting}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        아직 댓글이 없어요
                      </div>
                    )}
                  </div>
                </div>

                {/* 댓글 입력 */}
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) =>
                      e.key === "Enter" && !commentsManager.isCreating && handleAddComment()
                    }
                    disabled={commentsManager.isCreating}
                  />
                  <Button
                    onClick={handleAddComment}
                    size="icon"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={commentsManager.isCreating || !newComment.trim()}
                  >
                    {commentsManager.isCreating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 모달 */}
      <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editingComment?.content || ""}
              onChange={(e) =>
                setEditingComment((prev) => (prev ? { ...prev, content: e.target.value } : null))
              }
              placeholder="댓글을 입력하세요..."
              className="dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && handleUpdateComment()}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditingComment(null)}
                disabled={commentsManager.isUpdating}
              >
                취소
              </Button>
              <Button
                onClick={handleUpdateComment}
                disabled={commentsManager.isUpdating || !editingComment?.content.trim()}
              >
                수정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
