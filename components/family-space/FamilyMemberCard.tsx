import { Badge } from '@/components/ui/badge';
import { UIFamilyMember } from '@/types/family.type';
import { CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FamilyMemberCardProps {
  member: UIFamilyMember;
}

// 벌레 ID에 따른 타입 및 이모티콘 매핑
const getBugInfo = (bugId: number): { type: string; emoji: string } => {
  const bugInfoMap: Record<number, { type: string; emoji: string }> = {
    1: { type: '호박벌형', emoji: '🐝' },
    2: { type: '무당벌레형', emoji: '🐞' },
    3: { type: '라바형', emoji: '🐛' },
    4: { type: '나비형', emoji: '🦋' },
    5: { type: '장수풍뎅이형', emoji: '🪲' },
  };
  return bugInfoMap[bugId] || { type: '알 수 없음', emoji: '🐣' };
};

// 날짜 포맷팅 함수
const formatSurveyDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } catch {
    return '';
  }
};

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (member.hasSurveyCompleted && member.bugId) {
      // 설문조사 완료된 경우 - 벌레 타입에 따른 결과 페이지로 이동
      router.push(`/survey-result?bugId=${member.bugId}`);
    } else {
      // 설문조사 미완료인 경우 - 설문조사 페이지로 이동
      router.push('/survey');
    }
  };

  // 벌레 타입 표시 로직
  const displayText = () => {
    if (member.hasSurveyCompleted && member.bugId) {
      const bugInfo = getBugInfo(member.bugId);
      const dateText = member.surveyDate ? ` (📅 ${formatSurveyDate(member.surveyDate)})` : '';
      return `${bugInfo.emoji} ${bugInfo.type}${dateText}`;
    } else if (member.currentPlan) {
      return `📱 ${member.currentPlan.planSummary}`;
    } else {
      return '📵 요금제 없음';
    }
  };

  return (
    <div
      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl overflow-hidden ring-2 ring-green-100 dark:ring-green-800">
          {member.profileImage ? (
            <Image
              src={member.profileImage}
              alt={`${member.name}의 프로필`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{member.avatar}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">{member.name}</span>
            {member.hasSurveyCompleted ? (
              <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs px-2 py-0.5">
                <CheckCircle className="w-3 h-3 mr-1" />
                추천완료
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-600"
              >
                <Clock className="w-3 h-3 mr-1" />
                설문미완료
              </Badge>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">{displayText()}</div>
        </div>
      </div>
    </div>
  );
}
