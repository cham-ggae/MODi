'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { useMessageCardsManager } from '@/hooks/family';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MESSAGE_CARD_TEMPLATES,
  getTemplateById,
  DEFAULT_TEMPLATE,
} from '@/lib/constants/message-card-templates';

interface MessageCardCreatorProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCardCreated?: () => void;
  trigger?: React.ReactNode | null;
}

export function MessageCardCreator({
  isOpen,
  onOpenChange,
  onCardCreated,
  trigger,
}: MessageCardCreatorProps = {}) {
  const [internalIsOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('heart');
  const { toast } = useToast();

  const { createMessageCard, isCreating } = useMessageCardsManager();

  // 외부 제어 또는 내부 제어
  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalIsOpen;
  const setOpen = isControlled ? onOpenChange : setIsOpen;

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    const cardData = {
      imageType: selectedTemplate,
      content: content.trim(),
    };

    createMessageCard(cardData, {
      onSuccess: () => {
        // 폼 초기화
        setContent('');
        setSelectedTemplate('heart');
        setOpen?.(false);
        // 콜백 호출
        onCardCreated?.();
      },
    });
  };

  return (
    <>
      {!isControlled && trigger !== null && (
        <button onClick={() => setOpen?.(true)}>
          {trigger || (
            <Button
              size="sm"
              className="bg-green-500 text-white hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-10 h-10 p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen?.(false)}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
            />

            {/* Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl p-6 pt-4 max-w-md mx-auto"
              style={{ borderRadius: '20px' }}
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  메시지 카드 만들기
                </h2>
              </div>

              <div className="space-y-4">
                {/* 템플릿 선택 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    카드 템플릿
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MESSAGE_CARD_TEMPLATES.map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-3 rounded-xl transition-all ${
                            selectedTemplate === template.id
                              ? `${template.color} ring-2 ring-offset-2 ring-green-500`
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 내용 입력 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    내용
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="가족에게 전하고 싶은 메시지를 작성하세요"
                    rows={4}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* 미리보기 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    미리보기
                  </label>
                  <Card className="dark:bg-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const template = getTemplateById(selectedTemplate) || DEFAULT_TEMPLATE;
                          const Icon = template.icon;
                          return (
                            <Icon
                              className={`w-5 h-5 ${
                                template.color.split(' ')[1] || 'text-pink-600'
                              }`}
                            />
                          );
                        })()}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {(getTemplateById(selectedTemplate) || DEFAULT_TEMPLATE).name}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {content || '내용을 입력하세요'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 버튼 */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpen?.(false)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isCreating || !content.trim()}
                    className="flex-1 bg-[#5bc236] hover:bg-[#4ca52d] text-white"
                  >
                    {isCreating ? '생성 중...' : '카드 만들기'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
