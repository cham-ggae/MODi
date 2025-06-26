import { X, Users } from "lucide-react";

export function LeaveFamilyModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-xs p-6 relative flex flex-col items-center">
        {/* Family Icon */}
        <div className="flex justify-center w-full mt-2 mb-2">
          <Users className="w-8 h-8 text-green-500" />
        </div>
        {/* Close (optional) */}
        <button
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
        {/* Icon */}
        <div className="mb-2 mt-8"></div>
        {/* Title & Message */}
        <div className="text-sm text-semibold mb-2">정말 가족 스페이스를 탈퇴하시겠어요?</div>
        <div className="text-sm text-gray-600 text-center mb-6">
          가족 스페이스를 나가면
          <br />
          더 이상 가족과 함께할 수 없게 됩니다.
          <br />
          <span className="text-red-500">탈퇴 후 데이터는 복구할 수 없습니다.</span>
        </div>
        {/* Buttons */}
        <div className="flex flex-col items-center w-full  border-gray-200">
          <button
            className="w-full h-10 text-sm text-center rounded-xl text-red-500 hover:bg-red-50"
            onClick={onConfirm}
          >
            가족 스페이스 탈퇴하기
          </button>
          <div className="border-t border-gray-200 w-full -my-0.5" />
          <button
            className="w-full h-10 text-sm text-center rounded-xl text-blue-500 hover:bg-gray-50"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
