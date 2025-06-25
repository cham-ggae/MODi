import React from 'react';
import { Button } from '@/components/ui/button';
import { usePlantGameStore } from '@/store/usePlantGameStore';

const MissionBtn = () => {
  const setShowMissions = usePlantGameStore((s) => s.setShowMissions);
  return (
    <div className="flex justify-end mb-2 flex-shrink-0 mr-8">
      <Button
        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-6 py-2 text-sm"
        onClick={() => setShowMissions(true)}
      >
        미션하기
      </Button>
    </div>
  );
};

export default MissionBtn;