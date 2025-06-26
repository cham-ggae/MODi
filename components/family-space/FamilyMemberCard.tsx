import { Badge } from "@/components/ui/badge";
import { UIFamilyMember } from "@/types/family.type";
import { CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@radix-ui/react-avatar";
import { typeImageMap, bugIdToNameMap } from "@/lib/survey-result-data";

interface FamilyMemberCardProps {
  member: UIFamilyMember;
}

// 벌레 ID에 따른 타입 및 이모티콘 매핑
const getBugInfo = (bugId: number): { type: string; emoji: string } => {
  const bugInfoMap: Record<number, { type: string; emoji: string }> = {
    1: { type: "호박벌형", emoji: "🐝" },
    2: { type: "무당벌레형", emoji: "🐞" },
    3: { type: "라바형", emoji: "🐛" },
    4: { type: "나비형", emoji: "🦋" },
    5: { type: "개미형", emoji: "🐜" },
  };
  return bugInfoMap[bugId] || { type: "알 수 없음", emoji: "🐣" };
};

// 날짜 포맷팅 함수
const formatSurveyDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  } catch {
    return "";
  }
};

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleCardClick = () => {
    // 다른 사용자가 설문 미완료인 경우 아무것도 하지 않음
    // 현재 사용자는 user.nickname으로, 멤버는 member.name으로 비교
    if (!member.hasSurveyCompleted && user?.nickname !== member.name) {
      return;
    }

    if (member.hasSurveyCompleted && member.bugId) {
      // 설문조사 완료된 경우 - 벌레 타입에 따른 결과 페이지로 이동
      router.push(`/survey-result?bugId=${member.bugId}`);
    } else {
      // 설문조사 미완료인 경우 - 설문조사 페이지로 이동
      router.push("/survey");
    }
  };

  // 벌레 타입 표시 로직
  const displayText = () => {
    if (member.hasSurveyCompleted && member.bugId) {
      const bugInfo = getBugInfo(member.bugId);
      return (
        <>
          <span>{bugInfo.type}</span>
          {member.surveyDate && (
            <span className="ml-2 text-gray-400">{formatSurveyDate(member.surveyDate)}</span>
          )}
        </>
      );
    } else if (member.currentPlan) {
      return `📱 ${member.currentPlan.planSummary}`;
    } else {
      return "아직 성향 분석 전이에요";
    }
  };

  return (
    <div
      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white dark:bg-white rounded-full flex items-center justify-center text-xl overflow-hidden">
          {member.hasSurveyCompleted && member.bugId ? (
            <Image
              src={typeImageMap[bugIdToNameMap[member.bugId]]}
              alt={getBugInfo(member.bugId).type + " 프로필"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : member.profileImage ? (
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
              <Badge className="bg-[#ffffff] dark:bg-green-800 text-gray-700 dark:text-gray-100 text-[11px] px-1.5 py-0.5 font-semibold flex items-center gap-[2px] self-center hover:bg-green-50 dark:hover:bg-green-900">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span className="leading-none">추천완료</span>
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar />
                <Badge
                  variant="outline"
                  className="text-[11px] px-1.5 py-0.5 text-[#5bc236] dark:text-[#5bc236] border-[#5bc236] dark:border-[#5bc236] cursor-pointer hover:bg-[#e6fdd7] dark:hover:bg-green-900 font-semibold flex items-center gap-[2px] self-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/survey");
                  }}
                >
                  <Clock className="w-3 h-3" />
                  <span className="leading-none">성향파악하기</span>
                </Badge>
              </div>
            )}
          </div>

          {/* 버그 타입과 날짜를 한 줄에 좌우 정렬, 둘 다 text-xs로 */}
          {member.hasSurveyCompleted && member.bugId ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getBugInfo(member.bugId).type}
              </span>
              {member.surveyDate && (
                <span className="text-xs text-gray-400">{formatSurveyDate(member.surveyDate)}</span>
              )}
            </div>
          ) : member.currentPlan ? (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              📱 {member.currentPlan.planSummary}
            </span>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              아직 성향 분석 전이에요🧐
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
