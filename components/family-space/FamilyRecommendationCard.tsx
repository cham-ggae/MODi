import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function FamilyRecommendationCard() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          추천 받은 결합 하러 가기
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💝</div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">가족사랑 요금제</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                결합시 인원당 4천원 추가할인
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-full"
          >
            이동
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
