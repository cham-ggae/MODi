"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Heart, Star, Gift, Coffee, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessageCardsManager } from "@/hooks/family";

const cardTemplates = [
  { id: "heart", icon: Heart, color: "bg-pink-100 text-pink-600", name: "사랑" },
  { id: "star", icon: Star, color: "bg-yellow-100 text-yellow-600", name: "응원" },
  { id: "gift", icon: Gift, color: "bg-purple-100 text-purple-600", name: "선물" },
  { id: "coffee", icon: Coffee, color: "bg-brown-100 text-brown-600", name: "일상" },
  { id: "sun", icon: Sun, color: "bg-orange-100 text-orange-600", name: "기분" },
];

interface MessageCardCreatorProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCardCreated?: () => void;
  trigger?: React.ReactNode;
}

export function MessageCardCreator({
  isOpen,
  onOpenChange,
  onCardCreated,
  trigger,
}: MessageCardCreatorProps = {}) {
  const [internalIsOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("heart");
  const { toast } = useToast();

  const { createMessageCard, isCreating } = useMessageCardsManager();

  // 외부 제어 또는 내부 제어
  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalIsOpen;
  const setOpen = isControlled ? onOpenChange : setIsOpen;

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "내용을 입력해주세요",
        variant: "destructive",
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
        setContent("");
        setSelectedTemplate("heart");
        setOpen?.(false);
        // 콜백 호출
        onCardCreated?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && trigger !== null && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              size="sm"
              className="bg-green-500 text-white hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-10 h-10 p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md mx-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">메시지 카드 만들기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 템플릿 선택 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              카드 템플릿
            </label>
            <div className="flex gap-2 flex-wrap">
              {cardTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-xl transition-all ${
                      selectedTemplate === template.id
                        ? `${template.color} ring-2 ring-offset-2 ring-green-500`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    const template = cardTemplates.find((t) => t.id === selectedTemplate);
                    const Icon = template?.icon || Heart;
                    return (
                      <Icon
                        className={`w-5 h-5 ${template?.color.split(" ")[1] || "text-pink-600"}`}
                      />
                    );
                  })()}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {cardTemplates.find((t) => t.id === selectedTemplate)?.name || "템플릿"}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {content || "내용을 입력하세요"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Button
              onClick={() => setOpen?.(false)}
              variant="outline"
              className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-600"
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 text-white"
              disabled={isCreating}
            >
              {isCreating ? "생성 중..." : "생성하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
