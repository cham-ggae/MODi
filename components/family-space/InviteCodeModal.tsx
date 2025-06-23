import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Copy, Check, Share2, Edit2, Save, X } from 'lucide-react';
import { useKakaoInit, shareKakao } from '@/hooks/useKakaoShare';

interface InviteCodeModalProps {
  inviteCode: string;
  familyName: string;
  onGenerateCode: () => void;
  onCopyCode: () => void;
  onShareKakao?: () => void;
  onSaveFamilyName: (name: string) => void;
  copied: boolean;
  isLoading?: boolean;
  canInvite?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function InviteCodeModal({
  inviteCode,
  familyName,
  onGenerateCode,
  onCopyCode,
  onShareKakao: onShareKakaoProp,
  onSaveFamilyName,
  copied,
  isLoading = false,
  canInvite = true,
  isOpen,
  onOpenChange,
}: InviteCodeModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState('');

  useKakaoInit();

  const handleEditFamilyName = () => {
    setTempFamilyName(familyName);
    setIsEditingName(true);
  };

  const handleSaveFamilyName = () => {
    if (tempFamilyName.trim()) {
      onSaveFamilyName(tempFamilyName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempFamilyName('');
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isOpen && (
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-green-500 text-white hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-10 h-10 p-0"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md mx-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">가족 초대하기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {inviteCode ? (
            <>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">초대 코드</div>
                <Badge className="bg-green-500 text-white text-lg px-4 py-2 font-mono mb-3">
                  {inviteCode}
                </Badge>

                <div className="mb-4">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 justify-center">
                      <Input
                        value={tempFamilyName}
                        onChange={(e) => setTempFamilyName(e.target.value)}
                        className="text-center text-sm max-w-32 dark:bg-gray-600 dark:text-white"
                        placeholder="가족명 입력"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveFamilyName();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSaveFamilyName}
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        <Save className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="ghost" className="p-1">
                        <X className="w-3 h-3 text-gray-400" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        가족명: {familyName || '우리 가족'}
                      </span>
                      <Button
                        onClick={handleEditFamilyName}
                        size="sm"
                        variant="ghost"
                        className="p-1"
                      >
                        <Edit2 className="w-3 h-3 text-gray-400" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={onCopyCode}
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? '복사됨' : '복사'}
                  </Button>
                  <Button
                    onClick={handleShareKakao}
                    size="sm"
                    className="flex-1 bg-[#FEE500] hover:bg-[#FFEB3B] text-black"
                  >
                    카톡 공유
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-4xl mb-3">🔗</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  아직 초대 코드가 없어요
                </div>
                <Button
                  onClick={onGenerateCode}
                  className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 text-white"
                >
                  초대 코드 생성하기
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
