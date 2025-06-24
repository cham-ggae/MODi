import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryCardList } from "./HistoryCardList";

export function HistoryCardSection({ items }: { items: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 1);

  return (
    <div>
      <HistoryCardList items={visibleItems} />
      {items.length > 1 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm text-gray-500 hover:bg-transparent hover:text-green-600 dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-green-400"
          >
            {showAll ? "숨기기" : `더보기 (${items.length - 1}개 남음)`}
          </Button>
        </div>
      )}
    </div>
  );
}
