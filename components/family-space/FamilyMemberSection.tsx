import { Card, CardContent } from "@/components/ui/card";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { InviteCodeModal } from "./InviteCodeModal";
import { UIFamilyMember } from "@/types/family.type";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

interface FamilyMemberSectionProps {
  members: UIFamilyMember[];
  inviteCode: string;
  familyName: string;
  onGenerateCode: () => void;
  onCopyCode: () => void;
  onShareKakao: () => void;
  onSaveFamilyName: (name: string) => void;
  copied: boolean;
  isLoading: boolean;
  isUpdatingName?: boolean;
  canInvite: boolean;
  memberCount: number;
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
  isUpdatingName = false,
  canInvite = true,
  memberCount = 0,
}: FamilyMemberSectionProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-0 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {familyName || "우리 가족"}
            </h2>
            {memberCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{memberCount}명의 구성원</p>
            )}
          </div>
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!canInvite}
            className="bg-gray-100 border-gray-400  hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center"
          >
            <UserPlus className="w-4 h-4 block leading-none shrink-0 translate-x-[2px]" />
          </Button>
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

        <InviteCodeModal
          inviteCode={inviteCode}
          familyName={familyName}
          onGenerateCode={onGenerateCode}
          onCopyCode={onCopyCode}
          onShareKakao={onShareKakao}
          onSaveFamilyName={onSaveFamilyName}
          copied={copied}
          isLoading={isLoading}
          isUpdatingName={isUpdatingName}
          canInvite={canInvite}
          isOpen={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          trigger={null}
        />
      </CardContent>
    </Card>
  );
}
