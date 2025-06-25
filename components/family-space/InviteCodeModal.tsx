import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Copy, Check, Share2, Edit2, Save, X } from "lucide-react";
import { useKakaoInit, shareKakao } from "@/hooks/useKakaoShare";
import { motion } from "framer-motion";

interface InviteCodeModalProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  inviteCode: string;
  familyName: string;
  onGenerateCode: () => void;
  onCopyCode: () => void;
  onShareKakao?: () => void;
  onSaveFamilyName: (name: string) => void;
  copied: boolean;
  isLoading?: boolean;
  isUpdatingName?: boolean;
  canInvite?: boolean;
  trigger?: React.ReactNode;
}

export function InviteCodeModal({
  isOpen: isOpenProp,
  onOpenChange: onOpenChangeProp,
  inviteCode,
  familyName,
  onGenerateCode,
  onCopyCode,
  onShareKakao: onShareKakaoProp,
  onSaveFamilyName,
  copied,
  isLoading = false,
  isUpdatingName = false,
  canInvite = true,
  trigger,
}: InviteCodeModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState("");

  const isOpen = isOpenProp ?? internalIsOpen;
  const onOpenChange = onOpenChangeProp ?? setInternalIsOpen;

  useKakaoInit();

  const handleEditFamilyName = () => {
    setTempFamilyName(familyName);
    setIsEditingName(true);
  };

  const handleSaveFamilyName = () => {
    if (tempFamilyName.trim() && !isUpdatingName) {
      onSaveFamilyName(tempFamilyName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempFamilyName("");
    setIsEditingName(false);
  };

  const handleShareKakao = () => {
    if (onShareKakaoProp) {
      onShareKakaoProp();
    } else {
      shareKakao(inviteCode, familyName);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Overlay for closing on click */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => onOpenChange && onOpenChange(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl p-6 pt-4 max-w-md mx-auto"
            style={{ borderRadius: "20px" }}
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="text-center">
              <div className="font-semibold text-lg mb-2">초대 링크</div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center break-all font-mono text-lg font-bold text-black select-all">
                {inviteCode}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                채팅방의 초대 링크를 공유할 수 있습니다. 누구나 채팅방에 참여 요청을 할 수 있으니
                주의해 주세요.
              </div>
              {/* <a href="#" className="text-xs text-gray-500 underline mb-4 inline-block">
                초대 링크 설정 보기
              </a> */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={onCopyCode}
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "복사됨" : "복사하기"}
                </Button>
                <Button
                  onClick={handleShareKakao}
                  size="sm"
                  className="flex-1 bg-[#FEE500] hover:bg-[#FFEB3B] text-black"
                >
                  공유하기
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
