'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Mic, MicOff, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/use-speech';
import { useToast } from '@/hooks/use-toast';
import { useFamilySpaceStatus } from '@/hooks/use-family-space';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [familyMode, setFamilyMode] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { isSpeaking, speak, stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: sttSupported,
  } = useSpeechRecognition({
    onResult: (transcript) => {
      setMessage(transcript);
      toast({
        title: '음성인식 완료',
        description: `"${transcript}"`,
      });
    },
    onError: (error) => {
      toast({
        title: '음성인식 오류',
        description: '다시 시도해주세요.',
        variant: 'destructive',
      });
    },
  });

  // 입력창 음성 관련 핸들러
  const handleVoiceInput = () => {
    if (!sttSupported) {
      toast({
        title: '음성인식 미지원',
        description: '이 브라우저에서는 음성인식이 지원되지 않습니다.',
        variant: 'destructive',
      });
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl font-bold text-green-500">MODI</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
      {/* Family Mode Toggle */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              가족 결합 집중 모드
            </span>
          </div>
          <Switch
            checked={familyMode}
            onCheckedChange={setFamilyMode}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        {familyMode && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            가족 요금제 결합에 특화된 상담을 제공합니다
          </p>
        )}
      </div>
      {/* 채팅 메시지 영역만 스크롤 */}
      <div className="flex-1 overflow-y-auto">{children}</div>
      {/* 입력창 */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {sttSupported && (
              <Button
                onClick={handleVoiceInput}
                variant="outline"
                size="icon"
                className={`rounded-full w-12 h-12 transition-all duration-200 ${
                  isListening
                    ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 animate-pulse'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isListening ? '음성을 인식하고 있습니다...' : '메시지를 입력하세요...'}
              className="flex-1 rounded-full border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              disabled={isListening}
            />
            <Button
              // onClick={sendMessage} // 메시지 전송은 page에서 props로 내려받아 처리할 수 있음
              size="icon"
              className="bg-green-500 hover:bg-gray-600 dark:hover:bg-gray-400 rounded-full w-12 h-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
