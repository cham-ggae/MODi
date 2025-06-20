'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Star, Gift, Coffee, Sun, MessageCircle, Send, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMessageCardsManager } from '@/hooks/family';
import { MessageCard } from '@/types/message-card.type';
import Image from 'next/image';

const cardTemplates = [
  { id: 'heart', icon: Heart, color: 'bg-pink-100 text-pink-600', name: '사랑' },
  { id: 'star', icon: Star, color: 'bg-yellow-100 text-yellow-600', name: '응원' },
  { id: 'gift', icon: Gift, color: 'bg-purple-100 text-purple-600', name: '선물' },
  { id: 'coffee', icon: Coffee, color: 'bg-brown-100 text-brown-600', name: '일상' },
  { id: 'sun', icon: Sun, color: 'bg-orange-100 text-orange-600', name: '기분' },
];

export function MessageCardList() {
  const [selectedCard, setSelectedCard] = useState<MessageCard | null>(null);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const { messageCards, totalCount, isLoading, isDeleting, deleteMessageCard, refetch } =
    useMessageCardsManager();

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedCard) return;

    // TODO: 댓글 추가 API 연동 필요
    toast({
      title: '댓글이 추가되었습니다! 💬',
    });
    setNewComment('');
  };

  const handleDeleteCard = (fcid: number) => {
    if (confirm('정말로 이 메시지 카드를 삭제하시겠습니까?')) {
      deleteMessageCard(fcid);
    }
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
        {messageCards.map((card) => {
          const template = cardTemplates.find((t) => t.id === card.imageType);
          const Icon = template?.icon || Heart;

          return (
            <Card
              key={card.fcid}
              className="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-700"
              onClick={() => setSelectedCard(card)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${template?.color.split(' ')[1] || 'text-pink-600'}`} />
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
                  <span>{new Date(card.createdAt).toLocaleDateString('ko-KR')}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>0</span> {/* TODO: 댓글 수 API 연동 필요 */}
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
          );
        })}
      </div>

      {/* 카드 상세 모달 */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-md mx-auto dark:bg-gray-800 max-h-[80vh] overflow-y-auto">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 dark:text-white">
                  {(() => {
                    const template = cardTemplates.find((t) => t.id === selectedCard.imageType);
                    const Icon = template?.icon || Heart;
                    return (
                      <Icon
                        className={`w-5 h-5 ${template?.color.split(' ')[1] || 'text-pink-600'}`}
                      />
                    );
                  })()}
                  {cardTemplates.find((t) => t.id === selectedCard.imageType)?.name ||
                    selectedCard.imageType}
                </DialogTitle>
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
                      {new Date(selectedCard.createdAt).toLocaleDateString('ko-KR')}
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
                    댓글 (0) {/* TODO: 댓글 수 API 연동 필요 */}
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {/* TODO: 댓글 목록 API 연동 필요 */}
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      아직 댓글이 없어요
                    </div>
                  </div>
                </div>

                {/* 댓글 입력 */}
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button
                    onClick={handleAddComment}
                    size="icon"
                    className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
