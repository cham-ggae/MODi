'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Star, Gift, Coffee, Sun, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cardTemplates = [
  { id: 'love', icon: Heart, color: 'bg-pink-100 text-pink-600', name: '사랑' },
  { id: 'star', icon: Star, color: 'bg-yellow-100 text-yellow-600', name: '응원' },
  { id: 'gift', icon: Gift, color: 'bg-purple-100 text-purple-600', name: '선물' },
  { id: 'coffee', icon: Coffee, color: 'bg-brown-100 text-brown-600', name: '일상' },
  { id: 'sun', icon: Sun, color: 'bg-orange-100 text-orange-600', name: '기분' },
];

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface MessageCard {
  id: string;
  title: string;
  content: string;
  template: string;
  author: string;
  createdAt: string;
  comments: Comment[];
}

export function MessageCardList() {
  const [cards, setCards] = useState<MessageCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MessageCard | null>(null);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('messageCards') || '[]');
    setCards(savedCards);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedCard) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: '나',
      content: newComment.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };

    const updatedCards = cards.map((card) =>
      card.id === selectedCard.id ? { ...card, comments: [...card.comments, comment] } : card
    );

    setCards(updatedCards);
    localStorage.setItem('messageCards', JSON.stringify(updatedCards));
    setSelectedCard({ ...selectedCard, comments: [...selectedCard.comments, comment] });
    setNewComment('');

    toast({
      title: '댓글이 추가되었습니다! 💬',
    });
  };

  if (cards.length === 0) {
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
        {cards.map((card) => {
          const template = cardTemplates.find((t) => t.id === card.template);
          const Icon = template?.icon || Heart;

          return (
            <Card
              key={card.id}
              className="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-700"
              onClick={() => setSelectedCard(card)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${template?.color.split(' ')[1] || 'text-pink-600'}`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                  <span className="text-xs text-gray-400 ml-auto">{card.author}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{card.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{card.createdAt}</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{card.comments.length}</span>
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
                    const template = cardTemplates.find((t) => t.id === selectedCard.template);
                    const Icon = template?.icon || Heart;
                    return (
                      <Icon
                        className={`w-5 h-5 ${template?.color.split(' ')[1] || 'text-pink-600'}`}
                      />
                    );
                  })()}
                  {selectedCard.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* 카드 내용 */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">{selectedCard.content}</p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>{selectedCard.author}</span>
                    <span>{selectedCard.createdAt}</span>
                  </div>
                </div>

                {/* 댓글 목록 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    댓글 ({selectedCard.comments.length})
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedCard.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                          <span>{comment.author}</span>
                          <span>{comment.createdAt}</span>
                        </div>
                      </div>
                    ))}
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
