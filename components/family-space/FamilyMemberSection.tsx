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
}: FamilyMemberSectionProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">우리 가족</h2>
          <InviteCodeModal
            inviteCode={inviteCode}
            familyName={familyName}
            onGenerateCode={onGenerateCode}
            onCopyCode={onCopyCode}
            onShareKakao={onShareKakao}
            onSaveFamilyName={onSaveFamilyName}
            copied={copied}
          />
        </div>
        <div className="space-y-4">
          {members.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
