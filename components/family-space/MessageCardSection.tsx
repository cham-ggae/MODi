import { Card, CardContent } from '@/components/ui/card';
import { MessageCardCreator } from '@/components/message-card-creator';
import { MessageCardList } from '@/components/message-card-list';

export function MessageCardSection() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">메시지 카드 공유</h2>
          <MessageCardCreator />
        </div>
        <MessageCardList />
      </CardContent>
    </Card>
  );
}
