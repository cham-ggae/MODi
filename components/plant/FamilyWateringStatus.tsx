interface Member {
  id: number;
  name: string;
  avatar: string;
  hasWatered: boolean;
  status: string;
}

interface Props {
  members: Member[];
}

// 가족 구성원의 물주기 상태를 아이콘과 함께 보여줌

export const FamilyWateringStatus = ({ members }: Props) => {
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
};
