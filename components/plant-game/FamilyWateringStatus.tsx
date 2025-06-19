import { FamilyMember } from "@/types/plant-game.type";

interface Props {
  members: FamilyMember[];
}
// 가족 물주기 상태
export function FamilyWateringStatus({ members }: Props) {
  return (
    <div className="flex justify-center space-x-8 mb-8">
      {members.map((member) => (
        <div key={member.id} className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
              member.hasWatered ? "bg-blue-100 border-2 border-blue-400" : "bg-gray-100"
            }`}
          >
            <div className="text-2xl">{member.avatar}</div>
          </div>
          <div className="text-sm font-medium text-gray-900">{member.name}</div>
          {member.hasWatered && <div className="text-xs text-blue-500">{member.status}</div>}
        </div>
      ))}
    </div>
  );
}
