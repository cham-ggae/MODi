import { FamilyMember } from "@/types/plant-game.type";

interface Props {
  members: FamilyMember[];
}
// 가족 물주기 상태
export function FamilyWateringStatus({ members }: Props) {
  return (
    <div className="flex justify-center space-x-4 px-4">
      {members.map((member) => (
        <div key={member.id} className="text-center flex-1 max-w-[60px]">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 overflow-hidden mx-auto ${
              member.hasWatered ? "bg-blue-100 border-2 border-blue-400" : "bg-gray-100"
            }`}
          >
            {member.avatar.startsWith("http") ? (
              // 카카오 프로필 이미지인 경우
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이모지로 대체
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            {/* 기본 이모지 (이미지 로드 실패 시 표시) */}
            <div className={`text-lg ${member.avatar.startsWith("http") ? "hidden" : ""}`}>
              {member.avatar}
            </div>
          </div>
          <div className="text-xs font-medium text-gray-900 truncate">{member.name}</div>
          {member.hasWatered && (
            <div className="text-xs text-blue-500 truncate">{member.status}</div>
          )}
        </div>
      ))}
    </div>
  );
}
