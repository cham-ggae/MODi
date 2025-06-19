import { Button } from '@/components/ui/button';
import { FamilyMember } from '@/types/family-space.type';

interface FamilyMemberCardProps {
  member: FamilyMember;
}

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
          {member.avatar}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{member.plan}</div>
        </div>
      </div>
      {member.hasRecommendation && (
        <Button
          size="sm"
          className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
        >
          성향검사
        </Button>
      )}
    </div>
  );
}
