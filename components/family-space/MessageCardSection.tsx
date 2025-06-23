import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MessageCardList } from "./MessageCardList";
import { MessageCardCreator } from "./MessageCardCreator";
import { UIFamilyMember } from "@/types/family.type";
import { MessageCard } from "@/types/message-card.type";
import { useState } from "react";

interface MessageCardSectionProps {
  // 가족 API 연동을 위한 props
  familyId?: number;
  members?: UIFamilyMember[];
  memberCount?: number;
  // 메시지 카드 관련 props
  messageCards?: MessageCard[];
  totalCount?: number;
  isLoading?: boolean;
  // 콜백 함수
  onMessageCardCreated?: () => void;
}

export function MessageCardSection({
  familyId,
  members = [],
  memberCount = 0,
  messageCards = [],
  totalCount = 0,
  isLoading = false,
  onMessageCardCreated,
}: MessageCardSectionProps) {
  const [showMessageCardCreator, setShowMessageCardCreator] = useState(false);

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">메시지 카드 공유</h2>
              {memberCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {memberCount}명의 가족과 소통해보세요
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600 rounded-full w-10 h-10 p-0"
              onClick={() => setShowMessageCardCreator(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <MessageCardList />
        </CardContent>
      </Card>

      {/* 메시지 카드 생성기 */}
      <MessageCardCreator
        isOpen={showMessageCardCreator}
        onOpenChange={setShowMessageCardCreator}
        onCardCreated={onMessageCardCreated}
      />
    </>
  );
}
