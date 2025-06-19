import { Card, CardContent } from '@/components/ui/card';
import { FamilyMemberCard } from './FamilyMemberCard';
import { InviteCodeModal } from './InviteCodeModal';
import { FamilyMember } from '@/types/family-space.type';

interface FamilyMemberSectionProps {
  members: FamilyMember[];
  inviteCode: string;
  familyName: string;
  onGenerateCode: () => void;
  onCopyCode: () => void;
  onShareKakao: () => void;
  onSaveFamilyName: (name: string) => void;
  copied: boolean;
  isLoading?: boolean;
  canInvite?: boolean;
  memberCount?: number;
}

export function FamilyMemberSection({
  members,
  inviteCode,
  familyName,
  onGenerateCode,
  onCopyCode,
  onShareKakao,
  onSaveFamilyName,
  copied,
  isLoading = false,
  canInvite = true,
  memberCount = 0,
}: FamilyMemberSectionProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">우리 가족</h2>
            {memberCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{memberCount}명의 구성원</p>
            )}
          </div>
          <InviteCodeModal
            inviteCode={inviteCode}
            familyName={familyName}
            onGenerateCode={onGenerateCode}
            onCopyCode={onCopyCode}
            onShareKakao={onShareKakao}
            onSaveFamilyName={onSaveFamilyName}
            copied={copied}
            isLoading={isLoading}
            canInvite={canInvite}
          />
        </div>
        <div className="space-y-4">
          {members.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              아직 가족 구성원이 없습니다
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
