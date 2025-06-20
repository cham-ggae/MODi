import { Card, CardContent } from '@/components/ui/card';
import { MessageCardCreator } from './MessageCardCreator';
import { MessageCardList } from './MessageCardList';
import { UIFamilyMember } from '@/types/family.type';
import { MessageCard } from '@/types/message-card.type';

interface MessageCardSectionProps {
  // 가족 API 연동을 위한 props
  familyId?: number;
  members?: UIFamilyMember[];
  memberCount?: number;
  // 메시지 카드 관련 props
  messageCards?: MessageCard[];
  totalCount?: number;
  isLoading?: boolean;
}

export function MessageCardSection({
  familyId,
  members = [],
  memberCount = 0,
  messageCards = [],
  totalCount = 0,
  isLoading = false,
}: MessageCardSectionProps) {
  return (
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
          <MessageCardCreator />
        </div>
        <MessageCardList />
      </CardContent>
    </Card>
  );
}
