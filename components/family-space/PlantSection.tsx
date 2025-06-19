import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sprout, TreePine, Flower, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlantType } from '@/types/family-space.type';

interface PlantSectionProps {
  hasPlant: boolean;
  plantType?: PlantType;
  onPlantAction: () => void;
  familyNutrial?: number;
  familyDaysAfterCreation?: number;
}

export function PlantSection({
  hasPlant,
  plantType,
  onPlantAction,
  familyNutrial = 0,
  familyDaysAfterCreation = 0,
}: PlantSectionProps) {
  return (
    <div className="text-center py-8 flex-shrink-0">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        className="mb-6"
      >
        {hasPlant && plantType ? (
          <div className="w-24 h-24 mx-auto">
            <Image
              src={plantType === 'flower' ? '/images/flower5.png' : '/images/tree5.png'}
              alt={plantType === 'flower' ? '꽃' : '나무'}
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        ) : (
          <div className="text-6xl">🌱</div>
        )}
      </motion.div>

      <Button
        onClick={onPlantAction}
        className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full px-8 py-3 shadow-sm"
      >
        {hasPlant ? (
          <>
            <TreePine className="w-4 h-4 mr-2" />
            새싹 키우기
          </>
        ) : (
          <>
            <Sprout className="w-4 h-4 mr-2" />
            새싹 만들기
          </>
        )}
      </Button>

      {(familyNutrial > 0 || familyDaysAfterCreation > 0) && (
        <div className="flex justify-center gap-4 mt-4">
          {familyNutrial > 0 && (
            <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300">
              <Leaf className="w-3 h-3 mr-1" />
              영양제 {familyNutrial}개
            </Badge>
          )}
          {familyDaysAfterCreation > 0 && (
            <Badge className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-300">
              {familyDaysAfterCreation}일째 함께
            </Badge>
          )}
        </div>
      )}

      {hasPlant && plantType && (
        <div className="text-center mt-3">
          <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300">
            {plantType === 'flower' ? (
              <>
                <Flower className="w-3 h-3 mr-1" />꽃 키우는 중
              </>
            ) : (
              <>
                <TreePine className="w-3 h-3 mr-1" />
                나무 키우는 중
              </>
            )}
          </Badge>
        </div>
      )}
    </div>
  );
}
