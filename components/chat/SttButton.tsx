import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech';
import { useToast } from '../ui/use-toast';

interface SttButtonProps {
  setMessage: (text: string) => void;
}
const SttButton = ({ setMessage }: SttButtonProps) => {
  const { toast } = useToast();

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
    <div>
      <Button
        onClick={handleVoiceInput}
        variant="outline"
        size="icon"
        className={`rounded-full w-12 h-12 transition-all duration-200 ${isListening
          ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 animate-pulse'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default SttButton;